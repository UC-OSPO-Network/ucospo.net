// The common event model every source adapter normalizes into, plus helpers
// for windowing, de-duplicating, and sorting the merged set.
//
// Shape of a normalized event:
//   {
//     uid:         string   // stable, unique (source id + source's own id)
//     sourceId:    string   // 'network' | 'davis' | ... (matches config.SOURCES)
//     sourceLabel: string   // human label, e.g. 'UC Berkeley (BIDS)'
//     title:       string
//     start:       Date
//     end:         Date | null
//     allDay:      boolean
//     location:    string | null
//     url:         string | null   // link to the event detail page / registration
//     description: string | null
//   }

export function makeEvent(source, fields) {
  return {
    uid: `${source.id}:${fields.id}`,
    sourceId: source.id,
    sourceLabel: source.label,
    title: (fields.title || "Untitled event").trim(),
    start: fields.start,
    end: fields.end ?? null,
    allDay: Boolean(fields.allDay),
    location: fields.location?.trim() || null,
    url: fields.url || null,
    description: fields.description?.trim() || null,
    descriptionHtml: fields.descriptionHtml || null,
  };
}

// Keep events that end (or start, if no end) on/after `from` and start before
// `to`. Drops events with no usable start date.
export function withinWindow(events, from, to) {
  return events.filter((e) => {
    if (!(e.start instanceof Date) || isNaN(e.start)) return false;
    const effectiveEnd = e.end instanceof Date && !isNaN(e.end) ? e.end : e.start;
    return effectiveEnd >= from && e.start <= to;
  });
}

// De-duplicate across sources. Same talk can appear on both a campus calendar
// and the network calendar; collapse on a normalized title + start-time key.
export function dedupe(events) {
  const byKey = new Map();
  for (const e of events) {
    const key = `${e.title.toLowerCase().replace(/\s+/g, " ")}@${e.start?.toISOString?.() ?? ""}`;
    const existing = byKey.get(key);
    byKey.set(key, existing ? preferred(existing, e) : e);
  }
  return [...byKey.values()];
}

// Which of two colliding copies to keep:
//   1. Network-owned wins, so the canonical all-campus listing is preferred.
//   2. Same source: keep the richer description. A host editing one occurrence
//      to set that month's topic (which can land on another occurrence's slot
//      when also rescheduled) must not lose to the generic recurring blurb.
function preferred(a, b) {
  const aNet = a.sourceId === "network";
  const bNet = b.sourceId === "network";
  if (aNet !== bNet) return aNet ? a : b;
  return (b.description?.length ?? 0) > (a.description?.length ?? 0) ? b : a;
}

export function sortByStart(events) {
  return [...events].sort((a, b) => a.start - b.start);
}
