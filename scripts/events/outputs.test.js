import { test } from "node:test";
import assert from "node:assert/strict";
import { makeEvent } from "./normalize.js";
import { buildCalendar } from "./outputs.js";

const src = (id) => ({ id, label: id.toUpperCase() });

test("buildCalendar produces stable, deterministic DTSTAMP on repeated runs", () => {
  const start = new Date("2026-07-01T18:00:00Z");
  const stamp = new Date("2026-05-15T10:30:00Z");
  const event = makeEvent(src("network"), {
    id: "stable-1",
    title: "Network Meetup",
    start,
    stamp,
  });

  const ics1 = buildCalendar("UC OSPO—Network", [event]);
  const ics2 = buildCalendar("UC OSPO—Network", [event]);

  assert.equal(ics1, ics2, "Calendar output must be identical across runs");
  assert.match(ics1, /DTSTAMP:20260515T103000Z/, "DTSTAMP must match event.stamp");
});

test("buildCalendar reflects updated modification timestamp", () => {
  const start = new Date("2026-07-01T18:00:00Z");
  const eventV1 = makeEvent(src("network"), {
    id: "update-1",
    title: "Topic TBA",
    start,
    stamp: new Date("2026-05-01T12:00:00Z"),
  });
  const eventV2 = makeEvent(src("network"), {
    id: "update-1",
    title: "Topic Announced: Open Source Governance",
    start,
    stamp: new Date("2026-06-15T14:00:00Z"),
  });

  const icsV1 = buildCalendar("UC OSPO", [eventV1]);
  const icsV2 = buildCalendar("UC OSPO", [eventV2]);

  assert.match(icsV1, /DTSTAMP:20260501T120000Z/);
  assert.match(icsV2, /DTSTAMP:20260615T140000Z/);
  assert.notEqual(icsV1, icsV2);
});

test("buildCalendar falls back to start date when modification timestamp is missing or invalid", () => {
  const start = new Date("2026-08-10T19:00:00Z");

  const missingStamp = makeEvent(src("davis"), {
    id: "no-stamp",
    title: "No Stamp Event",
    start,
  });
  const icsMissing = buildCalendar("UC OSPO", [missingStamp]);
  assert.match(icsMissing, /DTSTAMP:20260810T190000Z/, "Must fall back to start date when stamp is missing");

  const invalidStamp = makeEvent(src("davis"), {
    id: "invalid-stamp",
    title: "Invalid Stamp Event",
    start,
    stamp: new Date("not-a-valid-date"),
  });
  const icsInvalid = buildCalendar("UC OSPO", [invalidStamp]);
  assert.match(icsInvalid, /DTSTAMP:20260810T190000Z/, "Must fall back to start date when stamp is invalid");
});

test("buildCalendar correctly sets distinct DTSTAMP for recurring occurrences and overrides", () => {
  const masterStamp = new Date("2026-05-01T09:00:00Z");
  const overrideStamp = new Date("2026-06-02T16:00:00Z");

  // Regular occurrence inheriting master timestamp
  const regularOcc = makeEvent(src("network"), {
    id: "rec-1-2026-06-01T17:00:00.000Z",
    title: "Monthly All-Campus Call",
    start: new Date("2026-06-01T17:00:00Z"),
    stamp: masterStamp,
  });

  // Override instance edited later with its own modification timestamp
  const overrideOcc = makeEvent(src("network"), {
    id: "rec-1-2026-07-01T17:00:00.000Z",
    title: "Special Summer All-Campus Call",
    start: new Date("2026-07-01T17:00:00Z"),
    stamp: overrideStamp,
  });

  const ics = buildCalendar("UC OSPO", [regularOcc, overrideOcc]);
  assert.match(ics, /UID:network:rec-1-2026-06-01T17:00:00\.000Z[\s\S]*?DTSTAMP:20260501T090000Z/);
  assert.match(ics, /UID:network:rec-1-2026-07-01T17:00:00\.000Z[\s\S]*?DTSTAMP:20260602T160000Z/);
});

test("buildCalendar preserves all existing calendar fields and format compatibility", () => {
  const start = new Date("2026-09-15T17:00:00Z");
  const end = new Date("2026-09-15T18:30:00Z");
  const stamp = new Date("2026-08-01T11:00:00Z");

  const event = makeEvent(src("ucsb"), {
    id: "compat-99",
    title: "Open Source Lounge",
    start,
    end,
    allDay: false,
    location: "Library Room 1411",
    url: "https://example.com/lounge",
    description: "Bring your laptop and projects.",
    stamp,
  });

  const ics = buildCalendar("UC OSPO—UC Santa Barbara", [event]);

  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /PRODID:-\/\/UC OSPO Network\/\/events\/\/EN/);
  assert.match(ics, /X-WR-CALNAME:UC OSPO—UC Santa Barbara/);
  assert.match(ics, /UID:ucsb:compat-99/);
  assert.match(ics, /SUMMARY:Open Source Lounge/);
  assert.match(ics, /LOCATION:Library Room 1411/);
  assert.match(ics, /URL(;VALUE=URI)?:https:\/\/example\.com\/lounge/);
  assert.match(ics, /DESCRIPTION:Bring your laptop and projects\./);
  assert.match(ics, /DTSTART:20260915T170000Z/);
  assert.match(ics, /DTEND:20260915T183000Z/);
  assert.match(ics, /DTSTAMP:20260801T110000Z/);
  assert.match(ics, /END:VEVENT/);
  assert.match(ics, /END:VCALENDAR/);
});
