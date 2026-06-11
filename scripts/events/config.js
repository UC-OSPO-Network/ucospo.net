// Source registry for the campus event aggregator.
//
// Each campus publishes events on its own platform. We read every source
// directly and merge them. Most are plain iCal feeds;
// UCSD and UCSC need adapters because they don't expose a usable .ics.
//
// See ./README.md for the full architecture, open TODOs, and deploy wiring.

export const SITE_URL = "https://ucospo.net";

// How far ahead the embed + list show events. Some calendars carry events that
// recur for years, so we cap the forward window to keep the page sane. Past
// events are handled separately (see README—Past Events stays manual for now).
export const FUTURE_WINDOW_DAYS = 120;

export const SOURCES = [
  {
    id: "network",
    label: "UC OSPO Network",
    type: "ics",
    // Google Calendar (network-wide, all-campus events). Owned by Laura.
    url: "https://calendar.google.com/calendar/ical/c_92ca749b4c01f221e16866c624be4377f8ccefbf0a079ec37f6960663c486e79%40group.calendar.google.com/public/basic.ics",
  },
  {
    id: "davis",
    label: "UC Davis",
    type: "ics",
    // Google Calendar, owned by Laura.
    url: "https://calendar.google.com/calendar/ical/c_48b163b72d75bfb691a1b211d16d13bbaf98524e332586a0c9963d0fd83f7505%40group.calendar.google.com/public/basic.ics",
  },
  {
    id: "ucsb",
    label: "UC Santa Barbara",
    type: "ics",
    // Google Calendar (public).
    url: "https://calendar.google.com/calendar/ical/c_99e456e1d3d1d5d320fb353647617fb72d9d9c01fc9368ed76e830c7e59108e6%40group.calendar.google.com/public/basic.ics",
  },
  {
    id: "berkeley",
    label: "UC Berkeley (BIDS)",
    type: "ics",
    // LiveWhale iCal feed for the "Berkeley Institute for Data Science" group
    // (the /BIDS/all shortname maps to an empty group; this is the real feed).
    url: "https://events.berkeley.edu/live/ical/events/group/Berkeley%20Institute%20for%20Data%20Science/header/Berkeley%20Institute%20for%20Data%20Science%20(BIDS)%20Events",
    // LiveWhale's .ics omits DESCRIPTION; its RSS variant carries it. We keep
    // the .ics for location/times/all-day and enrich descriptions from RSS,
    // matched by title (see fetchIcs in sources.js).
    rssUrl: "https://events.berkeley.edu/live/rss/events/group/Berkeley%20Institute%20for%20Data%20Science/header/BIDS",
  },
  {
    id: "ucsd",
    label: "UC San Diego",
    type: "localist",
    // Localist JSON API. No usable .ics (the .ics endpoint 406s), so we read
    // JSON and synthesize iCal ourselves.
    //
    // group_id 49482217391481 is the "UC San Diego Library" group. The API
    // ignores the widget's `tags=` param, so we fetch the library group and
    // filter to OSPO events by tag client-side (see `tag` below + sources.js).
    // Currently 0 upcoming—the OSPO events on https://ospo.ucsd.edu/events/
    // are all past; new ospo-tagged events will flow through automatically.
    base: "https://calendar.ucsd.edu/api/2/events",
    params: { group_id: 49482217391481, days: 365, pp: 100 },
    tag: "ospo",
  },
  {
    id: "ucsc",
    label: "UC Santa Cruz",
    type: "ucsc-rss",
    // Hugo site on GitHub Pages. MVP reads the RSS feed, where <pubDate> is the
    // event date (verified against known event dates).
    //
    // TODO(accuracy): upgrade to reading per-event frontmatter from the repo
    // (github.com/ucsc-ospo/ucsc-ospo.github.io, content/event/<slug>/index.md)
    // for end times + location, which RSS doesn't carry. gray-matter is already
    // a project dependency.
    url: "https://ucsc-ospo.github.io/event/index.xml",
  },
  // UCLA: intentionally omitted. No OSPO calendar yet—events only land on the
  // library's general events list. Add a source here when UCLA exposes a feed.
];
