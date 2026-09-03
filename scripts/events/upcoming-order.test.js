// Guards the ordering of the hand-written listings under "## Upcoming Events" in events/index.md.
//
// Why this exists: the listings are hand-maintained, and entries kept ending up out of order because nothing checked. A reader scrolling the page should never jump backwards in time. This runs as part of `npm test`, so it fires on every PR via `make check` and governs anyone editing the file, not just one tool.
//
// Pinning: some events are deliberately kept at the top regardless of date, because burying them defeats the point (UC Open is the case that matters). Mark those with a MyST comment on the line above the heading:
//
//     % EVENT:PINNED
//     ### UC Open 2027
//
// Pinned entries are skipped by the ordering check but still need a readable date, so they never become invisible. Everything unpinned must read forwards in time.
//
// Scope note: this validates the ORDER of entries whose dates it can read. It deliberately does not fail on entries with no parseable date (for example the series-level "First Thursday of every month" block), because those genuinely have no single date today. Once every entry carries a machine-readable date marker (see Projects/All-Campus Virtual Meetups/Architecture section 6, the date-ordered restructure), this check can be tightened to require one.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(HERE, "..", "..", "events", "index.md");

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

// "September 23 2026", "September 23, 2026", "Oct 6 2026"
const DATE_RE = new RegExp(
  `\\b(${Object.keys(MONTHS).join("|")})\\w*\\s+(\\d{1,2}),?\\s+(\\d{4})\\b`,
  "i",
);

/** Split the Upcoming Events section into `### ` entries. */
function upcomingEntries(markdown) {
  const start = markdown.indexOf("## Upcoming Events");
  assert.notEqual(start, -1, "events/index.md has no '## Upcoming Events' heading");
  let end = markdown.indexOf("\n## ", start + 1);
  if (end === -1) end = markdown.length;

  const section = markdown.slice(start, end);
  const entries = [];
  const re = /^### (.+)$/gm;
  let m;
  const marks = [];
  while ((m = re.exec(section)) !== null) marks.push({ title: m[1].trim(), at: m.index });

  for (let i = 0; i < marks.length; i++) {
    const body = section.slice(marks[i].at, marks[i + 1]?.at ?? section.length);
    const d = DATE_RE.exec(body);
    // A "% EVENT:PINNED" comment on the line(s) just above the heading opts the entry out of the ordering check.
    const before = section.slice(Math.max(0, marks[i].at - 200), marks[i].at);
    const pinned = /%\s*EVENT:PINNED\s*\n\s*$/.test(before);
    entries.push({
      title: marks[i].title,
      pinned,
      date: d ? new Date(Date.UTC(+d[3], MONTHS[d[1].toLowerCase()], +d[2])) : null,
      raw: d ? d[0] : null,
    });
  }
  return entries;
}

test("Upcoming Events entries are in chronological order", () => {
  const entries = upcomingEntries(fs.readFileSync(INDEX, "utf8"));
  const dated = entries.filter((e) => e.date && !e.pinned);

  assert.ok(dated.length > 0, "no dated, unpinned entries found under Upcoming Events");

  for (let i = 1; i < dated.length; i++) {
    const prev = dated[i - 1];
    const cur = dated[i];
    assert.ok(
      cur.date >= prev.date,
      `Upcoming Events is out of chronological order.\n` +
        `  "${prev.title}" (${prev.raw})\n` +
        `  comes before\n` +
        `  "${cur.title}" (${cur.raw})\n` +
        `  but ${cur.raw} is earlier. Move the entries so the page reads forwards in time,\n` +
        `  or add a "% EVENT:PINNED" comment above the heading if it belongs at the top on purpose.`,
    );
  }
});

test("every Upcoming Events entry either has a readable date or is a known series block", () => {
  const entries = upcomingEntries(fs.readFileSync(INDEX, "utf8"));
  const undated = entries.filter((e) => !e.date).map((e) => e.title);

  // Series-level blocks describe a recurrence rather than one date, so they are allowed through. Anything else without a date is invisible to the ordering check above, which is worth knowing about.
  const ALLOWED_UNDATED = [/All-Campus Virtual Meetups/i];
  const unexpected = undated.filter((t) => !ALLOWED_UNDATED.some((re) => re.test(t)));

  assert.deepEqual(
    unexpected,
    [],
    `These Upcoming Events entries have no parseable date, so the ordering check ` +
      `cannot see them:\n  ${unexpected.join("\n  ")}\n` +
      `Add a "**When**: Weekday, Month D YYYY" line, or add the title to ` +
      `ALLOWED_UNDATED in this test if it is genuinely a recurring series block. ` +
      `Note that pinning an entry does NOT exempt it from needing a date.`,
  );
});
