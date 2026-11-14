import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMBED_PATH = path.join(__dirname, "embed.html");
const INDEX_MD_PATH = path.join(__dirname, "..", "..", "events", "index.md");

test("embed.html produces a deterministic SHA-256 hash", () => {
  assert.ok(fs.existsSync(EMBED_PATH), "embed.html must exist");
  const bytes = fs.readFileSync(EMBED_PATH);
  const hash1 = crypto.createHash("sha256").update(bytes).digest("hex");
  const hash2 = crypto.createHash("sha256").update(bytes).digest("hex");

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
  assert.match(hash1, /^[0-9a-f]{64}$/);
});

test("events/index.md tracked source has clean iframe URL without hardcoded version parameter", () => {
  const markdown = fs.readFileSync(INDEX_MD_PATH, "utf8");
  assert.match(
    markdown,
    /<iframe[^>]+src="\/events-embed\.html"[^>]*><\/iframe>/,
    "Tracked events/index.md must reference /events-embed.html without hardcoded ?v= parameter",
  );
  assert.doesNotMatch(
    markdown,
    /\/events-embed\.html\?v=/,
    "Tracked events/index.md must not contain manual cache-busting query strings",
  );
});

test("iframe cache-busting regex correctly replaces clean and versioned URLs in HTML and JSON", () => {
  const hash = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
  const regex = /\/events-embed\.html(?:\?[^"'\s>]*)?/g;

  // Clean iframe reference (from fresh compilation)
  const cleanHtml = '<iframe src="/events-embed.html" title="Calendar"></iframe>';
  assert.equal(
    cleanHtml.replaceAll(regex, `/events-embed.html?v=${hash}`),
    `<iframe src="/events-embed.html?v=${hash}" title="Calendar"></iframe>`,
  );

  // Versioned iframe reference (rebuilds or older versions)
  const versionedHtml = '<iframe src="/events-embed.html?v=6" title="Calendar"></iframe>';
  assert.equal(
    versionedHtml.replaceAll(regex, `/events-embed.html?v=${hash}`),
    `<iframe src="/events-embed.html?v=${hash}" title="Calendar"></iframe>`,
  );

  // JSON route data
  const json = '{"type":"iframe","src":"/events-embed.html","width":"100%"}';
  assert.equal(
    json.replaceAll(regex, `/events-embed.html?v=${hash}`),
    `{"type":"iframe","src":"/events-embed.html?v=${hash}","width":"100%"}`,
  );
});
