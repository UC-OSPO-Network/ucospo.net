import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatUpcomingMarkdown,
  formatWhen,
  escapeHeading,
  formatUrl,
  isValidUrl,
} from "./format-markdown.js";
import { makeEvent } from "./normalize.js";

const src = (id, extra = {}) => ({ id, label: id.toUpperCase(), ...extra });
const ev = (id, fields, extraSrc = {}) => makeEvent(src(id, extraSrc), fields);

test("empty or non-array input produces valid, predictable Markdown", () => {
  assert.equal(formatUpcomingMarkdown([]), "");
  assert.equal(formatUpcomingMarkdown(null), "");
  assert.equal(formatUpcomingMarkdown(undefined), "");
});

test("an ongoing Office Hours event is excluded", () => {
  const ongoingEvent = ev("network", {
    id: "oh-1",
    title: "Office Hours (Tuesdays)",
    start: new Date("2026-10-06T17:00:00Z"),
    ongoing: true,
  });
  const normalEvent = ev("network", {
    id: "e-1",
    title: "All-Campus Virtual Meetup: October",
    start: new Date("2026-10-08T17:00:00Z"),
    ongoing: false,
  });

  const md = formatUpcomingMarkdown([ongoingEvent, normalEvent]);
  assert.ok(!md.includes("Office Hours (Tuesdays)"));
  assert.ok(md.includes("All-Campus Virtual Meetup: October"));
});

test("an unrelated recurring event is retained", () => {
  const recurringEvent = ev("network", {
    id: "orb-1",
    title: "ORB Community Call",
    start: new Date("2026-10-06T20:00:00Z"), // recurring series
    ongoing: false,
  });

  const md = formatUpcomingMarkdown([recurringEvent]);
  assert.ok(md.includes("ORB Community Call"));
});

test("an unrelated event on a Tuesday is retained", () => {
  // 2026-10-06 is a Tuesday
  const tuesdayEvent = ev("ucla", {
    id: "tue-talk",
    title: "UCLA Tech Talk: Tuesday Edition",
    start: new Date("2026-10-06T19:00:00Z"),
  });

  const md = formatUpcomingMarkdown([tuesdayEvent]);
  assert.ok(md.includes("UCLA Tech Talk: Tuesday Edition"));
});

test("an unrelated event on a Thursday is retained", () => {
  // 2026-10-08 is a Thursday
  const thursdayEvent = ev("berkeley", {
    id: "thu-workshop",
    title: "Berkeley Python Workshop",
    start: new Date("2026-10-08T22:00:00Z"),
  });

  const md = formatUpcomingMarkdown([thursdayEvent]);
  assert.ok(md.includes("Berkeley Python Workshop"));
});

test("events are grouped under correct ### Month YYYY headings", () => {
  const oct = ev("davis", {
    id: "oct-1",
    title: "October Event",
    start: new Date("2026-10-15T18:00:00Z"),
  });
  const nov = ev("ucsb", {
    id: "nov-1",
    title: "November Event",
    start: new Date("2026-11-12T18:00:00Z"),
  });

  const md = formatUpcomingMarkdown([oct, nov]);
  assert.ok(md.includes("### October 2026"));
  assert.ok(md.includes("### November 2026"));
  assert.ok(md.indexOf("### October 2026") < md.indexOf("### November 2026"));
});

test("months and events within each month are in chronological order", () => {
  const nov = ev("davis", {
    id: "nov",
    title: "November Talk",
    start: new Date("2026-11-05T18:00:00Z"),
  });
  const octLate = ev("ucla", {
    id: "oct-late",
    title: "Late October Talk",
    start: new Date("2026-10-25T18:00:00Z"),
  });
  const octEarly = ev("ucsc", {
    id: "oct-early",
    title: "Early October Talk",
    start: new Date("2026-10-05T18:00:00Z"),
  });

  // Pass shuffled
  const md = formatUpcomingMarkdown([nov, octLate, octEarly]);

  const earlyIdx = md.indexOf("Early October Talk");
  const lateIdx = md.indexOf("Late October Talk");
  const novIdx = md.indexOf("November Talk");

  assert.ok(earlyIdx !== -1 && lateIdx !== -1 && novIdx !== -1);
  assert.ok(earlyIdx < lateIdx, "Events within month must be ordered chronologically");
  assert.ok(lateIdx < novIdx, "Months must be ordered chronologically");
});

test("no empty month headings are generated when events in a month are ongoing", () => {
  const ongoingOct = ev("network", {
    id: "oh-oct",
    title: "Office Hours (Tuesdays)",
    start: new Date("2026-10-06T17:00:00Z"),
    ongoing: true,
  });
  const novEvent = ev("davis", {
    id: "nov-1",
    title: "Davis November Meetup",
    start: new Date("2026-11-10T18:00:00Z"),
  });

  const md = formatUpcomingMarkdown([ongoingOct, novEvent]);
  assert.ok(!md.includes("### October 2026"), "Month with only ongoing events must not produce heading");
  assert.ok(md.includes("### November 2026"));
});

test("missing location is handled safely without Where line", () => {
  const e = ev("davis", {
    id: "no-loc",
    title: "Online Webinar",
    start: new Date("2026-10-10T17:00:00Z"),
    location: null,
  });

  const md = formatUpcomingMarkdown([e]);
  assert.ok(!md.includes("**Where**:"));
  assert.ok(!md.includes("null"));
  assert.ok(!md.includes("undefined"));
  // When line shouldn't end in trailing backslash if there's no Where
  assert.ok(!/\*\*When\*\*: [^\n\\]+\\\n/m.test(md));
});

test("missing description is handled safely without empty paragraphs", () => {
  const e = ev("davis", {
    id: "no-desc",
    title: "Quick Sync",
    start: new Date("2026-10-10T17:00:00Z"),
    description: null,
    location: "Library Room 101",
  });

  const md = formatUpcomingMarkdown([e]);
  assert.ok(!md.includes("null"));
  assert.ok(!md.includes("undefined"));
  assert.ok(!md.includes("\n\n\n\n")); // no run of blank lines
});

test("missing URL is handled safely without register button", () => {
  const e = ev("davis", {
    id: "no-url",
    title: "Internal Meeting",
    start: new Date("2026-10-10T17:00:00Z"),
    url: null,
  });

  const md = formatUpcomingMarkdown([e]);
  assert.ok(!md.includes("register-btn"));
  assert.ok(!md.includes("[Register here]"));
  assert.ok(!md.includes("null"));
  assert.ok(!md.includes("undefined"));
});

test("date and time formatting uses Pacific Time convention", () => {
  // 2026-10-06T19:00:00Z is 12:00 PM Pacific (PDT, UTC-7)
  const e = ev("ucla", {
    id: "tz-test",
    title: "Paul Eggert Talk",
    start: new Date("2026-10-06T19:00:00Z"),
    end: new Date("2026-10-06T20:00:00Z"),
  });

  const whenStr = formatWhen(e);
  assert.equal(whenStr, "Tuesday, October 6, 2026, 12:00 PM – 1:00 PM Pacific");

  const md = formatUpcomingMarkdown([e]);
  assert.ok(md.includes("**When**: Tuesday, October 6, 2026, 12:00 PM – 1:00 PM Pacific"));
});

test("allDay event formats date without time", () => {
  const e = ev("ucsc", {
    id: "allday-test",
    title: "CruzCon",
    start: new Date("2026-10-22T07:00:00Z"),
    allDay: true,
  });

  const whenStr = formatWhen(e);
  assert.equal(whenStr, "Thursday, October 22, 2026");
});

test("full event with location, description, and register link formats properly", () => {
  const e = ev("ucla", {
    id: "full-test",
    title: "UCLA Open Source Meetup",
    start: new Date("2026-10-06T19:00:00Z"),
    end: new Date("2026-10-06T20:00:00Z"),
    location: "Room 11630L",
    description: "A conversation with Paul Eggert.",
    url: "https://calendar.library.ucla.edu/event/17080330",
  });

  const md = formatUpcomingMarkdown([e]);
  const expected = [
    "### October 2026",
    "",
    "#### UCLA Open Source Meetup",
    "",
    "**When**: Tuesday, October 6, 2026, 12:00 PM – 1:00 PM Pacific\\",
    "**Where**: Room 11630L",
    "",
    "A conversation with Paul Eggert.",
    "",
    ":::{div}",
    ":class: register-btn",
    "[Register here](https://calendar.library.ucla.edu/event/17080330)",
    ":::",
    "",
  ].join("\n");

  assert.equal(md, expected);
});

test("heading sanitization preserves meaningful # in C# and F# titles", () => {
  assert.equal(escapeHeading("C# Programming Workshop"), "C# Programming Workshop");
  assert.equal(escapeHeading("F# for Data Science"), "F# for Data Science");
  assert.equal(escapeHeading("Introduction to C# and .NET"), "Introduction to C# and .NET");
});

test("heading sanitization strips leading heading markers but preserves internal #", () => {
  assert.equal(escapeHeading("### C# Programming Workshop"), "C# Programming Workshop");
  assert.equal(escapeHeading("## F# for Data Science"), "F# for Data Science");
  assert.equal(escapeHeading("# Just A Title"), "Just A Title");
  assert.equal(escapeHeading("####    Lots of spaces"), "Lots of spaces");
  assert.equal(escapeHeading("###"), "Untitled event");
  assert.equal(escapeHeading(""), "Untitled event");
  assert.equal(escapeHeading(null), "Untitled event");
});

test("heading sanitization prevents newline injection into headings", () => {
  assert.equal(
    escapeHeading("C# Workshop\r\n## Injected Heading"),
    "C# Workshop ## Injected Heading",
  );
  assert.equal(
    escapeHeading("First Line\nSecond Line\nThird Line"),
    "First Line Second Line Third Line",
  );
});

test("URL formatting properly percent-encodes parentheses in URLs", () => {
  assert.equal(
    formatUrl("https://calendar.example.edu/event(123)"),
    "https://calendar.example.edu/event%28123%29",
  );
  assert.equal(
    formatUrl("https://zoom.us/j/12345?pwd=(secret_token)"),
    "https://zoom.us/j/12345?pwd=%28secret_token%29",
  );
  assert.equal(
    formatUrl("https://example.com/path(1)/sub(2)?a=(b)&c=d"),
    "https://example.com/path%281%29/sub%282%29?a=%28b%29&c=d",
  );
});

test("URL formatting handles query parameters, spaces, and preserves relative paths", () => {
  assert.equal(
    formatUrl("https://example.com/register?foo=bar&baz=qux"),
    "https://example.com/register?foo=bar&baz=qux",
  );
  assert.equal(
    formatUrl("/events/local-register?id=42"),
    "/events/local-register?id=42",
  );
  assert.equal(
    formatUrl("https://example.com/event with spaces"),
    "https://example.com/event%20with%20spaces",
  );
});

test("URL validation strictly rejects unsafe URL schemes", () => {
  assert.equal(isValidUrl("javascript:alert(1)"), false);
  assert.equal(isValidUrl("data:text/html;base64,PHNjcmlwdD4="), false);
  assert.equal(isValidUrl("file:///etc/passwd"), false);
  assert.equal(isValidUrl("ftp://example.com"), false);
  assert.equal(isValidUrl(""), false);
  assert.equal(isValidUrl(null), false);

  assert.equal(formatUrl("javascript:alert(1)"), "");
});

test("full event formatting keeps C# in heading and properly links URL with parentheses", () => {
  const e = ev("ucsd", {
    id: "csharp-event",
    title: "### C# Programming Workshop",
    start: new Date("2026-10-15T19:00:00Z"),
    url: "https://calendar.ucsd.edu/event(999)?ref=(email)",
  });

  const md = formatUpcomingMarkdown([e]);
  assert.ok(md.includes("#### C# Programming Workshop"));
  assert.ok(
    md.includes("[Register here](https://calendar.ucsd.edu/event%28999%29?ref=%28email%29)"),
  );
});
