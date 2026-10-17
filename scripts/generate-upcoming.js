#!/usr/bin/env node
// Pre-build generator for the Upcoming Events Markdown partial.
//
// Fetches campus event feeds, normalizes/deduplicates them across the 120-day
// forward window, formats them into MyST Markdown grouped by month, and writes
// the partial to events/_upcoming.md so `myst build --html` can include it.
//
// Run BEFORE `myst build --html`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES, FUTURE_WINDOW_DAYS } from "./events/config.js";
import { fetchSource } from "./events/sources.js";
import { withinWindow, dedupe, sortByStart } from "./events/normalize.js";
import { formatUpcomingMarkdown } from "./events/format-markdown.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_FILE = path.join(__dirname, "..", "events", "_upcoming.md");

const now = new Date();
const to = new Date(+now + FUTURE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
const window = { from: now, to };

console.log(`Fetching events for upcoming list (${FUTURE_WINDOW_DAYS}-day window)...`);

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

if (failures.length === SOURCES.length) {
  console.error(`\nAll ${SOURCES.length} event source(s) failed. Aborting generation.`);
  process.exit(1);
}

const events = sortByStart(dedupe(collected));
const markdown = formatUpcomingMarkdown(events);

try {
  fs.mkdirSync(path.dirname(TARGET_FILE), { recursive: true });
  fs.writeFileSync(TARGET_FILE, markdown, "utf8");
  console.log(`\nWrote generated upcoming events to ${path.relative(process.cwd(), TARGET_FILE)}`);
} catch (err) {
  console.error(`\nFailed to write upcoming events partial: ${err.message}`);
  process.exit(1);
}
