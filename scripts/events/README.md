# Campus event aggregator

Pulls every UC OSPO campus event calendar into one merged feed, calendar embed,
and set of subscribable `.ics` files for the Events page. Each campus publishes
on its own platform (Google Calendar, LiveWhale, Localist, a Hugo site); the
aggregator reads those sources directly and merges them.

## How it runs

The aggregator runs at build time, right after `myst build` (same pattern as
`generate-feed.js`). It's wired into the `html` target in the `Makefile`, which
is what both production (`deploy.yml`) and PR checks use:

```bash
npx myst build --html && node scripts/generate-feed.js && node scripts/aggregate-events.js
```

It fetches all sources, merges/de-duplicates
/windows them, and writes into
`_build/html/feeds/`:

| Output           | Path                                                 | Used by                      |
| ---------------- | ---------------------------------------------------- | ---------------------------- |
| Merged feed      | `/feeds/events.json`                                 | the calendar embed + list    |
| Subscribe-all    | `/feeds/uc-ospo-all.ics`                             | "subscribe to everything"    |
| Per-source feeds | `/feeds/{network,davis,ucsb,berkeley,ucsd,ucsc}.ics` | subscribe to any combination |

## Staying fresh & deploy wiring

Production is **GitHub Pages**: `deploy.yml` runs `make html` (which includes
the aggregator) and pushes `_build/html` to the `UC-OSPO-Network.github.io`
repo. Feeds are generated at build time, so they only change when that runs.

`deploy.yml` runs on push to `main` **and on a 12h schedule**, so the feeds
stay current with upstream campus calendars even during stretches with no
pushes. The scheduled run reuses the existing `CI_DEPLOY_KEY` and needs no
extra secret.

Separately, `.github/workflows/refresh-events.yml` runs `validate-events` on a
12h schedule and fails loudly if any campus source breaks. It only alerts; it
does not deploy.

(Netlify still builds PR previews via `netlify.toml` so the embed renders in
previews, but it is not production.)

Two consequences worth knowing:

- **Subscriptions ride a rolling window.** Each rebuild re-runs the aggregator
  with a fresh `FUTURE_WINDOW_DAYS` window, so a subscriber's calendar app
  re-polling the `.ics` always sees the next ~120 days. They stay current _as
  long as the scheduled deploy keeps running_. The durable fix is RRULE
  pass-through (see TODOs).
- **The subscribe links are absolute prod URLs** (`https://ucospo.net/feeds/…`
  in `events/index.md`). That's intentional so subscriptions point at a stable
  address, but it means PR previews link to the _production_ feeds, not the
  preview build's own feeds.

## Sources

| Campus                         | Adapter          | Status                                                       |
| ------------------------------ | ---------------- | ------------------------------------------------------------ |
| Network (Google Cal)           | `ics`            | ✅                                                           |
| UC Davis (Google Cal)          | `ics`            | ✅                                                           |
| UC Santa Barbara (Google Cal)  | `ics`            | ✅                                                           |
| UC Berkeley / BIDS (LiveWhale) | `ics` + `rssUrl` | ✅ .ics for times/location, RSS for descriptions (see below) |
| UC San Diego (Localist)        | `localist`       | ✅ library group + `ospo` tag filter (0 upcoming now)        |
| UC Santa Cruz (Hugo)           | `ucsc-rss`       | ✅ MVP via RSS; frontmatter upgrade pending                  |
| UCLA                           | (none)           | omitted: no OSPO calendar yet                                |

LiveWhale's `.ics` export omits `DESCRIPTION` entirely, so the Berkeley source
also sets `rssUrl`: `fetchIcs` keeps the `.ics` for location/times/all-day and
fills in descriptions from the matching RSS feed, keyed by title. Any future
LiveWhale campus gets the same treatment by adding an `rssUrl` to its source.

Add or change sources in `config.js`.

## Open TODOs

- **UCSC accuracy**: upgrade from RSS to reading per-event frontmatter from
  `github.com/ucsc-ospo/ucsc-ospo.github.io` (`content/event/<slug>/index.md`)
  for end times + location. `gray-matter` is already a dependency.
- **Recurring subscriptions**: per-source `.ics` feeds carry the in-window
  expanded occurrences (capped by `FUTURE_WINDOW_DAYS`), not the original
  recurrence rules. They stay current via the rolling rebuild (see "Staying
  fresh"), but the durable fix is to pass through original `RRULE`s so a
  subscription recurs indefinitely without depending on constant rebuilds.
- **Past events**: still the manual list in `events/index.md`. Decide later
  whether to auto-generate from a wider backward window.

## Local dev

```bash
npm install            # picks up node-ical, ical-generator, rss-parser
npm run events         # writes feeds to _build/html/feeds/ (run after a build)
npm run validate-events  # fetch + per-source counts, no write; non-zero on error
```
