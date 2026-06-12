// Writes the build artifacts the events page consumes:
//   - events.json        : merged, windowed feed for the calendar embed + list
//   - <source>.ics        : one subscribable feed per campus (+ network)
//
// Subscribe-to-any-combination is covered by per-source feeds: a user who wants
// "network + my campus" subscribes to network.ics and their campus's .ics.

import icalGenerator from "ical-generator";
import fs from "fs";
import path from "path";
import { SITE_URL, SOURCES } from "./config.js";

function buildCalendar(name, events) {
  const cal = icalGenerator({ name, prodId: { company: "UC OSPO Network", product: "events" } });
  for (const e of events) {
    cal.createEvent({
      id: e.uid,
      start: e.start,
      end: e.end || undefined,
      allDay: e.allDay,
      summary: e.title,
      location: e.location || undefined,
      description: e.description || undefined,
      url: e.url || undefined,
    });
  }
  return cal.toString();
}

export function writeOutputs(events, outDir, failedIds = new Set()) {
  fs.mkdirSync(outDir, { recursive: true });

  // 1. JSON feed for the embed + list (FullCalendar-shaped).
  const json = events.map((e) => ({
    id: e.uid,
    title: e.title,
    start: e.start.toISOString(),
    end: e.end ? e.end.toISOString() : null,
    allDay: e.allDay,
    url: e.url,
    source: e.sourceId,
    sourceLabel: e.sourceLabel,
    location: e.location,
    description: e.description,
    descriptionHtml: e.descriptionHtml,
  }));
  fs.writeFileSync(path.join(outDir, "events.json"), JSON.stringify(json, null, 2));

  // 2. One feed per source. Skip sources that failed this run so we keep the
  //    last good feed instead of overwriting it with an empty one.
  // TODO: pass through original RRULEs for true recurring subscriptions;
  //       right now feeds carry the in-window expanded occurrences only.
  let perSourceFeeds = 0;
  for (const source of SOURCES) {
    if (failedIds.has(source.id)) continue;
    const subset = events.filter((e) => e.sourceId === source.id);
    fs.writeFileSync(
      path.join(outDir, `${source.id}.ics`),
      buildCalendar(`UC OSPO—${source.label}`, subset),
    );
    perSourceFeeds++;
  }

  return { count: events.length, icsFeeds: perSourceFeeds, outDir, site: SITE_URL };
}
