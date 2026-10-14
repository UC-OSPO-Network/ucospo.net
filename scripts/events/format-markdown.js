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

const headingDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
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

export function formatHeadingTitle(event, seenHeadings) {
  const baseTitle = escapeHeading(event.title);
  if (!seenHeadings) {
    return baseTitle;
  }
  if (!seenHeadings.has(baseTitle)) {
    seenHeadings.add(baseTitle);
    return baseTitle;
  }

  let dateStr = "";
  if (event.start instanceof Date && !isNaN(event.start)) {
    dateStr = headingDateFormatter.format(event.start);
  }

  let uniqueTitle = dateStr ? `${baseTitle} (${dateStr})` : baseTitle;
  if (seenHeadings.has(uniqueTitle)) {
    let disambiguated = uniqueTitle;
    let counter = 2;
    while (seenHeadings.has(disambiguated)) {
      disambiguated = `${uniqueTitle} (${counter})`;
      counter++;
    }
    uniqueTitle = disambiguated;
  }

  seenHeadings.add(uniqueTitle);
  return uniqueTitle;
}

function sanitizeText(text) {
  return (text || "").trim();
}

export function formatDescription(text) {
  if (!text || typeof text !== "string") return "";

  // 1. Protect inline code spans `...`
  const codeSpans = [];
  let tokenized = text.replace(/`+[^`]+`+/g, (match) => {
    const idx = codeSpans.length;
    codeSpans.push(match);
    return `__MD_CODE_${idx}__`;
  });

  // 2. Normalize concatenated sentences or missing whitespace from upstream feeds
  tokenized = tokenized.replace(
    /([a-z])(Check out the rest of the series\b)/g,
    "$1. $2",
  );
  tokenized = tokenized.replace(/([.!?])\(/g, "$1 (");

  // 3. Convert markdown links whose visible text is a URL: [https://...](dest) -> [Event link](dest)
  // Preserve images and non-URL labels as-is.
  const preservedLinks = [];
  tokenized = tokenized.replace(
    /!?\[([^\]]*)\]\(([^)\s]+(?:\s+["\x27][^"\x27]*["\x27])?)\)/g,
    (match, label, dest) => {
      if (match.startsWith("!")) {
        const idx = preservedLinks.length;
        preservedLinks.push(match);
        return `__MD_LINK_${idx}__`;
      }
      const trimmedLabel = label.trim();
      const isUrl = /^https?:\/\//i.test(trimmedLabel);
      const finalLabel = isUrl ? "Event link" : label;
      const idx = preservedLinks.length;
      preservedLinks.push(`[${finalLabel}](${dest})`);
      return `__MD_LINK_${idx}__`;
    },
  );

  // 3. Protect autolinks <http...>
  const autolinks = [];
  tokenized = tokenized.replace(/<(https?:\/\/[^>]+)>/g, (match) => {
    const idx = autolinks.length;
    autolinks.push(match);
    return `__MD_AUTOLINK_${idx}__`;
  });

  // 4. Convert bare URLs in text to protected [Event link](url) tokens
  tokenized = tokenized.replace(
    /\b(https?:\/\/[^\s<>[\]()]+(?:\([^\s<>[\]()]+\)[^\s<>[\]()]*)*)/gi,
    (match) => {
      let cleanUrl = match;
      let trailing = "";
      while (/[.,;:!?]$/.test(cleanUrl)) {
        trailing = cleanUrl.slice(-1) + trailing;
        cleanUrl = cleanUrl.slice(0, -1);
      }
      const idx = preservedLinks.length;
      preservedLinks.push(`[Event link](${cleanUrl})`);
      return `__MD_LINK_${idx}__${trailing}`;
    },
  );

  // 5. Normalize whitespace after closing parentheses or markdown links followed directly by words
  tokenized = tokenized.replace(/\)([A-Za-z])/g, ") $1");
  tokenized = tokenized.replace(/(__MD_LINK_\d+__)([A-Za-z])/g, "$1 $2");

  // 6. Restore preserved tokens
  tokenized = tokenized.replace(/__MD_AUTOLINK_(\d+)__/g, (_, i) => autolinks[Number(i)]);
  tokenized = tokenized.replace(/__MD_LINK_(\d+)__/g, (_, i) => preservedLinks[Number(i)]);
  tokenized = tokenized.replace(/__MD_CODE_(\d+)__/g, (_, i) => codeSpans[Number(i)]);

  // 6. Ensure clean paragraph separation between bullet lists and subsequent non-list text
  tokenized = tokenized.replace(/(^|\n)([-*]\s+[^\n]+)\n([^-*\s#`>])/g, "$1$2\n\n$3");

  return tokenized.trim();
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

function formatEventEntry(event, seenHeadings) {
  const parts = [];

  const title = formatHeadingTitle(event, seenHeadings);
  parts.push(`#### ${title}`);

  const when = formatWhen(event);
  const location = sanitizeText(event.location);

  if (location) {
    parts.push(`**When**: ${when}\\\n**Where**: ${location}`);
  } else {
    parts.push(`**When**: ${when}`);
  }

  const description = formatDescription(event.description);
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
  const seenHeadings = new Set();

  for (const group of sortedGroups) {
    group.events.sort((a, b) => a.start - b.start);
    const eventBlocks = group.events.map((e) =>
      formatEventEntry(e, seenHeadings),
    );
    monthSections.push(`### ${group.heading}\n\n${eventBlocks.join("\n\n")}`);
  }

  return monthSections.join("\n\n") + "\n";
}
