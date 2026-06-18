// Per-platform adapters. Each returns an array of normalized events
// (see normalize.js). Recurring events from iCal feeds are expanded into
// individual occurrences within the requested window.

import ical from "node-ical";
import Parser from "rss-parser";
import { makeEvent } from "./normalize.js";

// Abort any source fetch that stalls, so one slow campus server can't hang the
// whole build (Node's global fetch has no default timeout).
const FETCH_TIMEOUT_MS = 15000;

// HTML to plain text, but keep the structure (line breaks + list bullets) so
// the .ics DESCRIPTION reads properly in a subscriber's calendar app instead of
// collapsing to one line.
function stripHtml(html) {
  if (!html) return null;
  const text = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&#x27;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text || null;
}

// Google Calendar iCal exports omit the URL property but put the
// registration/Zoom link in the (HTML) description. Fall back to a link there so
// events stay clickable. Prefer a meeting/registration link over an incidental
// content link (e.g. a speaker's project page), else take the first URL.
function firstUrl(html) {
  if (!html) return null;
  const urls = [...html.matchAll(/https?:\/\/[^\s"'<>)]+/gi)].map((m) =>
    m[0].replace(/&amp;/g, "&"),
  );
  if (!urls.length) return null;
  const preferred = urls.find((u) =>
    /zoom\.us|\/register|eventbrite|meet\.google|teams\.microsoft/i.test(u),
  );
  return preferred || urls[0];
}

// node-ical's rrule expansion yields occurrences with the right wall-clock time
// but labeled UTC, which drops the calendar's real offset (10:00 Pacific comes
// out as 10:00Z). Re-anchor such a naive Date: read its UTC fields as the
// intended local time and return the correct absolute instant in `tz` (DST-aware
// via Intl).
function tzOffsetMs(date, tz) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(
    dtf.formatToParts(date).map((x) => [x.type, x.value]),
  );
  const asUTC = Date.UTC(
    +p.year,
    +p.month - 1,
    +p.day,
    +p.hour,
    +p.minute,
    +p.second,
  );
  return asUTC - date.getTime();
}
function wallToZoned(naive, tz) {
  const utcGuess = Date.UTC(
    naive.getUTCFullYear(),
    naive.getUTCMonth(),
    naive.getUTCDate(),
    naive.getUTCHours(),
    naive.getUTCMinutes(),
    naive.getUTCSeconds(),
  );
  return new Date(utcGuess - tzOffsetMs(new Date(utcGuess), tz));
}

// Google Calendar inserts Unicode line/paragraph separators (U+2028/U+2029)
// into descriptions pasted from rich text (Docs/Word). node-ical's line
// unfolder treats them as line breaks, mis-parses the fold, and silently drops
// the ENTIRE DESCRIPTION property. Neutralize them before parsing. (NBSP and
// other non-terminator chars are fine—they don't break the unfolder.)
const ICS_LINE_SEPARATORS = /[\u2028\u2029]/g;

const titleKey = (t) => (t || "").toLowerCase().replace(/\s+/g, " ").trim();

// RSS item bodies often lead with the group's logo image; drop leading media so
// the popover opens on the description text, not a thumbnail.
function stripLeadingMedia(html) {
  return html
    .replace(/^\s*<picture[\s\S]*?<\/picture>\s*/i, "")
    .replace(/^\s*<img[^>]*>\s*/i, "")
    .trim();
}

// LiveWhale's .ics omits DESCRIPTION, but its RSS variant carries it. Build a
// title -> description map from the RSS feed so fetchIcs can fill the gap while
// keeping the .ics's location/times. Best-effort: a missing/broken RSS feed
// just leaves descriptions empty rather than failing the source.
async function fetchRssDescriptions(url) {
  const map = new Map();
  try {
    const feed = await rss.parseURL(url);
    for (const item of feed.items || []) {
      const key = titleKey(item.title);
      if (!key || map.has(key)) continue;
      const html = stripLeadingMedia(item.content || "");
      map.set(key, {
        description: item.contentSnippet?.trim() || stripHtml(html),
        descriptionHtml: html || null,
        url: item.link || null,
      });
    }
  } catch {
    // Enrichment is optional; .ics events still render without descriptions.
  }
  return map;
}

// --- iCal feeds: Berkeley (LiveWhale) + the three Google Calendars ----------
async function fetchIcs(source, { from, to }) {
  const res = await fetch(source.url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`ICS HTTP ${res.status} for ${source.id}`);
  const text = (await res.text()).replace(ICS_LINE_SEPARATORS, " ");
  const data = ical.sync.parseICS(text);
  const events = [];

  for (const ev of Object.values(data)) {
    if (ev.type !== "VEVENT" || !ev.start) continue;

    const base = {
      title: ev.summary,
      location: ev.location,
      url: ev.url || firstUrl(ev.description) || null,
      description: stripHtml(ev.description),
      descriptionHtml: ev.description || null,
      allDay: ev.datetype === "date",
    };
    const durationMs =
      ev.end instanceof Date && ev.start instanceof Date ? ev.end - ev.start : null;

    if (ev.rrule) {
      // Recurring: expand occurrences in-window, honoring EXDATEs and
      // per-instance overrides (RECURRENCE-ID). node-ical keys ev.recurrences
      // by the overridden occurrence's date (YYYY-MM-DD). A host editing a
      // single occurrence (e.g. setting that month's All-Campus topic, or
      // rescheduling it) lands there, so we skip the generic master at any
      // overridden slot and emit the override at its own start below.
      const tz = ev.rrule.origOptions?.tzid || "America/Los_Angeles";
      const exdates = new Set(Object.values(ev.exdate || {}).map((d) => +d));
      const overrides = ev.recurrences || {};
      for (const occ of ev.rrule.between(from, to, true)) {
        if (exdates.has(+occ)) continue;
        if (overrides[occ.toISOString().slice(0, 10)]) continue; // replaced below
        const start = wallToZoned(occ, tz);
        events.push(
          makeEvent(source, {
            ...base,
            id: `${ev.uid}-${occ.toISOString()}`,
            start,
            end: durationMs != null ? new Date(+start + durationMs) : null,
          }),
        );
      }
      // Override starts are already absolute (no wallToZoned). Out-of-window
      // and cancelled overrides are dropped (withinWindow + the status check).
      for (const ov of Object.values(overrides)) {
        if (!ov.start || ov.status === "CANCELLED") continue;
        events.push(
          makeEvent(source, {
            id: `${ev.uid}-${(ov.recurrenceid ?? ov.start).toISOString()}`,
            title: ov.summary ?? base.title,
            location: ov.location,
            url: ov.url || firstUrl(ov.description) || null,
            description: stripHtml(ov.description),
            descriptionHtml: ov.description || null,
            allDay: ov.datetype === "date",
            start: ov.start,
            end: ov.end || null,
          }),
        );
      }
    } else {
      events.push(
        makeEvent(source, { ...base, id: ev.uid, start: ev.start, end: ev.end || null }),
      );
    }
  }

  // Enrich descriptions from a sibling RSS feed (LiveWhale .ics omits them).
  if (source.rssUrl) {
    const descByTitle = await fetchRssDescriptions(source.rssUrl);
    for (const ev of events) {
      if (ev.description) continue;
      const hit = descByTitle.get(titleKey(ev.title));
      if (!hit) continue;
      ev.description = hit.description;
      ev.descriptionHtml = hit.descriptionHtml;
      ev.url = ev.url || hit.url;
    }
  }
  return events;
}

// --- UCSD: Localist JSON API ------------------------------------------------
async function fetchLocalist(source) {
  const url = new URL(source.base);
  for (const [k, v] of Object.entries(source.params)) {
    if (v != null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Localist HTTP ${res.status}`);
  const data = await res.json();

  const events = [];
  for (const wrapper of data.events || []) {
    const ev = wrapper.event;
    // The API ignores the tags= query param, so filter by tag here.
    if (source.tag) {
      const tags = (ev.tags || []).map((t) => String(t).toLowerCase());
      if (!tags.includes(source.tag.toLowerCase())) continue;
    }
    // TODO: Localist can return multiple event_instances (recurring); we take
    // the first for now.
    const inst = ev.event_instances?.[0]?.event_instance;
    if (!inst?.start) continue;
    events.push(
      makeEvent(source, {
        id: String(ev.id),
        title: ev.title,
        start: new Date(inst.start),
        end: inst.end ? new Date(inst.end) : null,
        allDay: Boolean(inst.all_day),
        location: ev.location_name || ev.room_number || null,
        url: ev.localist_url || ev.url || null,
        description: ev.description_text || stripHtml(ev.description),
        descriptionHtml: ev.description || null,
      }),
    );
  }
  return events;
}

// --- UCSC: Hugo RSS (MVP; see config TODO for the frontmatter upgrade) ------
const rss = new Parser({ timeout: FETCH_TIMEOUT_MS });
async function fetchUcscRss(source) {
  const feed = await rss.parseURL(source.url);
  return (feed.items || []).map((item, i) =>
    makeEvent(source, {
      id: item.guid || item.link || `ucsc-${i}`,
      title: item.title,
      // <pubDate> is the event date for this feed (verified). No end/location in RSS.
      start: item.isoDate ? new Date(item.isoDate) : new Date(item.pubDate),
      end: null,
      allDay: false,
      location: null,
      url: item.link || null,
      description: item.contentSnippet || null,
      descriptionHtml: item.content || null,
    }),
  );
}

const ADAPTERS = {
  ics: fetchIcs,
  localist: fetchLocalist,
  "ucsc-rss": fetchUcscRss,
};

export async function fetchSource(source, window) {
  const adapter = ADAPTERS[source.type];
  if (!adapter) throw new Error(`No adapter for source type "${source.type}"`);
  return adapter(source, window);
}
