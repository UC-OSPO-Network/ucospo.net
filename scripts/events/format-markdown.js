// Pure Markdown formatter for the Upcoming Events section.
//
// Converts an array of normalized events into a MyST Markdown partial grouped
// by month (### Month YYYY) with individual event entries (#### Event Title).
// Excludes ongoing coworking / office hours and handles missing fields safely.

const PACIFIC_TZ = "America/Los_Angeles";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: PACIFIC_TZ,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: PACIFIC_TZ,
});

const monthHeadingFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: PACIFIC_TZ,
});

export function escapeHeading(text) {
  const sanitized = (text || "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .replace(/^#+\s*/, "")
    .trim();
  return sanitized || "Untitled event";
}

function sanitizeText(text) {
  return (text || "").trim();
}

export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  );
}

export function formatUrl(url) {
  if (!isValidUrl(url)) return "";
  return url
    .trim()
    .replace(/[\r\n]+/g, "")
    .replace(/\s+/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

export function formatWhen(event) {
  const start = event.start;
  const end =
    event.end instanceof Date && !isNaN(event.end) ? event.end : null;

  const startDateStr = dateFormatter.format(start);

  if (event.allDay) {
    if (end && end.getTime() > start.getTime()) {
      // iCal all-day DTEND is typically exclusive midnight of the next day.
      // Subtract 1 second to inspect the last inclusive instant.
      const lastInstant = new Date(end.getTime() - 1000);
      const endDateStr = dateFormatter.format(lastInstant);
      if (endDateStr !== startDateStr) {
        return `${startDateStr} – ${endDateStr}`;
      }
    }
    return startDateStr;
  }

  const startTimeStr = timeFormatter.format(start);
  if (end && end.getTime() > start.getTime()) {
    const endDateStr = dateFormatter.format(end);
    const endTimeStr = timeFormatter.format(end);
    if (startDateStr === endDateStr) {
      return `${startDateStr}, ${startTimeStr} – ${endTimeStr} Pacific`;
    }
    return `${startDateStr}, ${startTimeStr} – ${endDateStr}, ${endTimeStr} Pacific`;
  }

  return `${startDateStr}, ${startTimeStr} Pacific`;
}

function formatEventEntry(event) {
  const parts = [];

  const title = escapeHeading(event.title);
  parts.push(`#### ${title}`);

  const when = formatWhen(event);
  const location = sanitizeText(event.location);

  if (location) {
    parts.push(`**When**: ${when}\\\n**Where**: ${location}`);
  } else {
    parts.push(`**When**: ${when}`);
  }

  const description = sanitizeText(event.description);
  if (description) {
    parts.push(description);
  }

  if (isValidUrl(event.url)) {
    const url = formatUrl(event.url);
    parts.push(`:::{div}\n:class: register-btn\n[Register here](${url})\n:::`);
  }

  return parts.join("\n\n");
}

export function formatUpcomingMarkdown(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return "";
  }

  // 1. Exclude events marked ongoing === true and invalid start dates
  const eligible = events.filter(
    (e) => !e.ongoing && e.start instanceof Date && !isNaN(e.start),
  );

  if (eligible.length === 0) {
    return "";
  }

  // 2. Sort all eligible events chronologically by start
  const sorted = [...eligible].sort((a, b) => a.start - b.start);

  // 3. Group by Month YYYY (Pacific time)
  const monthGroups = new Map();

  for (const event of sorted) {
    const parts = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      timeZone: PACIFIC_TZ,
    }).formatToParts(event.start);

    const year = Number(parts.find((p) => p.type === "year")?.value);
    const month = Number(parts.find((p) => p.type === "month")?.value);
    const sortKey = year * 100 + month;
    const heading = monthHeadingFormatter.format(event.start);

    if (!monthGroups.has(sortKey)) {
      monthGroups.set(sortKey, {
        sortKey,
        heading,
        events: [],
      });
    }
    monthGroups.get(sortKey).events.push(event);
  }

  // 4. Sort month groups chronologically
  const sortedGroups = [...monthGroups.values()].sort(
    (a, b) => a.sortKey - b.sortKey,
  );

  // 5. Format into Markdown
  const monthSections = [];

  for (const group of sortedGroups) {
    group.events.sort((a, b) => a.start - b.start);
    const eventBlocks = group.events.map(formatEventEntry);
    monthSections.push(`### ${group.heading}\n\n${eventBlocks.join("\n\n")}`);
  }

  return monthSections.join("\n\n") + "\n";
}
