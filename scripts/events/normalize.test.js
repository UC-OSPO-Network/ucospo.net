// Unit tests for the merge/window/dedupe helpers. These are the bug-prone,
// pure-function parts of the aggregator. Run with `npm test` (node --test).

import { test } from "node:test";
import assert from "node:assert/strict";
import { makeEvent, withinWindow, dedupe, sortByStart } from "./normalize.js";

const src = (id) => ({ id, label: id.toUpperCase() });
const ev = (id, fields) => makeEvent(src(id), fields);

const FROM = new Date("2026-06-01T00:00:00Z");
const TO = new Date("2026-09-29T00:00:00Z"); // ~120 days later

// --- withinWindow ----------------------------------------------------------

test("withinWindow keeps an event starting inside the window", () => {
  const e = ev("davis", { id: "1", title: "In window", start: new Date("2026-07-01T17:00:00Z") });
  assert.deepEqual(withinWindow([e], FROM, TO), [e]);
});

test("withinWindow drops an event with no usable start date", () => {
  const e = ev("davis", { id: "2", title: "No start", start: undefined });
  assert.deepEqual(withinWindow([e], FROM, TO), []);
});

test("withinWindow drops an event starting after the window", () => {
  const e = ev("davis", { id: "3", title: "Too late", start: new Date("2026-10-15T17:00:00Z") });
  assert.deepEqual(withinWindow([e], FROM, TO), []);
});

test("withinWindow keeps an event that started before the window but is still ongoing", () => {
  const e = ev("davis", {
    id: "4",
    title: "Ongoing",
    start: new Date("2026-05-20T17:00:00Z"),
    end: new Date("2026-06-05T17:00:00Z"),
  });
  assert.deepEqual(withinWindow([e], FROM, TO), [e]);
});

test("withinWindow drops a past event with no end (start used as the effective end)", () => {
  const e = ev("davis", { id: "5", title: "Past", start: new Date("2026-05-01T17:00:00Z") });
  assert.deepEqual(withinWindow([e], FROM, TO), []);
});

// --- dedupe / preferred ----------------------------------------------------

test("dedupe collapses the same event across campuses, keeping the network copy", () => {
  const start = new Date("2026-07-02T17:00:00Z");
  const networkCopy = ev("network", { id: "n1", title: "All-Campus Meetup", start, description: "short" });
  const campusCopy = ev("davis", {
    id: "d1",
    title: "All-Campus Meetup",
    start,
    description: "a much longer, richer description from the campus calendar",
  });
  const out = dedupe([campusCopy, networkCopy]);
  assert.equal(out.length, 1);
  // Network wins even though the campus copy has the richer description.
  assert.equal(out[0].sourceId, "network");
});

test("dedupe keeps the richer description when both copies are from the same source", () => {
  const start = new Date("2026-07-02T17:00:00Z");
  const generic = ev("davis", { id: "d1", title: "Meetup", start, description: "short" });
  const detailed = ev("davis", { id: "d2", title: "Meetup", start, description: "a much longer, richer description" });
  const out = dedupe([generic, detailed]);
  assert.equal(out.length, 1);
  assert.equal(out[0].description, "a much longer, richer description");
});

test("dedupe treats titles differing only in case/whitespace as the same event", () => {
  const start = new Date("2026-07-02T17:00:00Z");
  const a = ev("davis", { id: "d1", title: "Open  Source   Meetup", start });
  const b = ev("davis", { id: "d2", title: "open source meetup", start });
  assert.equal(dedupe([a, b]).length, 1);
});

test("dedupe keeps genuinely different events", () => {
  const start = new Date("2026-07-02T17:00:00Z");
  const a = ev("davis", { id: "d1", title: "Event A", start });
  const b = ev("davis", { id: "d2", title: "Event B", start });
  assert.equal(dedupe([a, b]).length, 2);
});

// --- sortByStart -----------------------------------------------------------

test("sortByStart orders by start ascending without mutating the input", () => {
  const a = ev("davis", { id: "a", title: "A", start: new Date("2026-08-01T00:00:00Z") });
  const b = ev("davis", { id: "b", title: "B", start: new Date("2026-06-15T00:00:00Z") });
  const c = ev("davis", { id: "c", title: "C", start: new Date("2026-07-10T00:00:00Z") });
  const input = [a, b, c];
  const out = sortByStart(input);
  assert.deepEqual(out.map((e) => e.title), ["B", "C", "A"]);
  assert.deepEqual(input.map((e) => e.title), ["A", "B", "C"]); // input untouched
});

// --- makeEvent -------------------------------------------------------------

test("makeEvent builds a stable uid and normalizes fields", () => {
  const e = ev("davis", {
    id: "42",
    title: "  Spaced  ",
    start: new Date("2026-07-02T17:00:00Z"),
    description: "  hi  ",
  });
  assert.equal(e.uid, "davis:42");
  assert.equal(e.sourceId, "davis");
  assert.equal(e.title, "Spaced");
  assert.equal(e.description, "hi");
  assert.equal(e.end, null);
  assert.equal(e.allDay, false);
});
