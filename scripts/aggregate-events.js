#!/usr/bin/env node
// Campus event aggregator. Reads every source in scripts/events/config.js,
// merges them into one windowed set, and writes the embed/list JSON plus
// subscribable .ics feeds into _build/html/feeds/.
//
// Run after `myst build --html` (like scripts/generate-feed.js). A scheduled
// GitHub Action (.github/workflows/refresh-events.yml) triggers a rebuild so
// the feeds stay current between pushes.
//
// Flags:
//   --validate-only   Fetch and report per-source counts without writing.
//                     Exits non-zero if any source errors—used for alerting.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SOURCES, FUTURE_WINDOW_DAYS } from "./events/config.js";
import { fetchSource } from "./events/sources.js";
import { withinWindow, dedupe, sortByStart } from "./events/normalize.js";
import { writeOutputs } from "./events/outputs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "_build", "html", "feeds");
const validateOnly = process.argv.includes("--validate-only");

const now = new Date();
const to = new Date(+now + FUTURE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
const window = { from: now, to };

const results = await Promise.allSettled(
  SOURCES.map((s) => fetchSource(s, window)),
);

const collected = [];
const failures = [];

results.forEach((result, i) => {
  const source = SOURCES[i];
  if (result.status === "fulfilled") {
    const inWindow = withinWindow(result.value, now, to);
    collected.push(...inWindow);
    const flag = inWindow.length === 0 ? "  ⚠ zero in-window events" : "";
    console.log(`  ${source.id.padEnd(9)} ${String(inWindow.length).padStart(3)} events${flag}`);
  } else {
    failures.push({ id: source.id, error: result.reason?.message || String(result.reason) });
    console.error(`  ${source.id.padEnd(9)} FAILED: ${result.reason?.message || result.reason}`);
  }
});

const events = sortByStart(dedupe(collected));
console.log(`\nMerged ${events.length} events across ${SOURCES.length - failures.length}/${SOURCES.length} sources (window: ${FUTURE_WINDOW_DAYS}d).`);

if (validateOnly) {
  // Health check for CI: loud failure if any source broke so a campus can't
  // silently drop off the calendar.
  if (failures.length) {
    console.error(`\n${failures.length} source(s) failed: ${failures.map((f) => f.id).join(", ")}`);
    process.exit(1);
  }
  process.exit(0);
}

// Skip writing per-source feeds for sources that failed this run, so a campus
// whose feed is briefly down keeps its last good .ics instead of being
// overwritten with an empty one.
const failedIds = new Set(failures.map((f) => f.id));

try {
  const summary = writeOutputs(events, OUT_DIR, failedIds);
  console.log(`Wrote events.json + ${summary.icsFeeds} .ics feeds to ${summary.outDir}`);

  // Copy the standalone calendar embed into the build root so it's served at
  // /events-embed.html (the events page iframes it). MyST relocates/hashes files
  // under static/, so we publish this one directly, like the feeds above.
  const buildRoot = path.join(OUT_DIR, "..");
  fs.copyFileSync(path.join(__dirname, "events", "embed.html"), path.join(buildRoot, "events-embed.html"));
  console.log("Copied events-embed.html to build root");

  // Vendor DOMPurify next to the embed so it loads from our own origin (served at
  // /purify.min.js) instead of a third-party CDN. Version is pinned in
  // package.json; bump it with `npm update dompurify`.
  fs.copyFileSync(
    path.join(__dirname, "..", "node_modules", "dompurify", "dist", "purify.min.js"),
    path.join(buildRoot, "purify.min.js"),
  );
  console.log("Copied purify.min.js to build root");

  // Vendor the site's Atkinson Hyperlegible font next to the embed so the iframe
  // (a separate document that can't inherit the page's @font-face) renders in the
  // site font. Served at /fonts/; keep the weights in sync with the @font-face in
  // embed.html and static/css/custom.css.
  const fontsDir = path.join(buildRoot, "fonts");
  fs.mkdirSync(fontsDir, { recursive: true });
  for (const weight of ["400", "700"]) {
    const file = `atkinson-hyperlegible-latin-${weight}-normal.woff2`;
    fs.copyFileSync(path.join(__dirname, "..", "static", "fonts", file), path.join(fontsDir, file));
  }
  console.log("Copied Atkinson Hyperlegible fonts to build root /fonts");
} catch (err) {
  console.error(`\nFailed to write build outputs: ${err.message}`);
  process.exit(1);
}

// Don't fail the site build if a single source is down—the page still
// renders with the rest. The validate job is what alerts on failures.
if (failures.length) {
  console.warn(`\nNote: ${failures.length} source(s) were unavailable this run and are missing from the feeds.`);
}
