import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatUpcomingMarkdown,
  formatWhen,
  escapeHeading,
  formatUrl,
  isValidUrl,
  formatDescription,
  formatHeadingTitle,
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

test("formatDescription converts URL-shaped link labels while preserving destinations", () => {
  assert.equal(
    formatDescription("Check [https://example.com](https://example.com) for details."),
    "Check [Event link](https://example.com) for details.",
  );
  assert.equal(
    formatDescription("See [http://example.org/path?q=1](http://example.org/path?q=1)."),
    "See [Event link](http://example.org/path?q=1).",
  );
  assert.equal(
    formatDescription("Visit [https://old.edu/link](https://new.edu/actual-target)."),
    "Visit [Event link](https://new.edu/actual-target).",
  );
});

test("formatDescription preserves meaningful link labels, images, and inline code", () => {
  assert.equal(
    formatDescription("Visit [the project website](https://example.com) for details."),
    "Visit [the project website](https://example.com) for details.",
  );
  assert.equal(
    formatDescription("Read the [UC OSPO Report](https://ucospo.net/report) online."),
    "Read the [UC OSPO Report](https://ucospo.net/report) online.",
  );
  assert.equal(
    formatDescription("![Campus Map](https://example.edu/map.png)"),
    "![Campus Map](https://example.edu/map.png)",
  );
  assert.equal(
    formatDescription("Run `curl https://api.example.com` to inspect."),
    "Run `curl https://api.example.com` to inspect.",
  );
});

test("formatDescription converts bare URLs and handles surrounding punctuation", () => {
  assert.equal(
    formatDescription("Visit https://example.com for details."),
    "Visit [Event link](https://example.com) for details.",
  );
  assert.equal(
    formatDescription("Join https://example.com/event?id=123 for details."),
    "Join [Event link](https://example.com/event?id=123) for details.",
  );
  assert.equal(
    formatDescription("Zoom: https://ucsb.zoom.us/j/87889247304"),
    "Zoom: [Event link](https://ucsb.zoom.us/j/87889247304)",
  );
  assert.equal(
    formatDescription("Sign up (https://forms.gle/fKjzxbKFScfAMxks5) now!"),
    "Sign up ([Event link](https://forms.gle/fKjzxbKFScfAMxks5)) now!",
  );
  assert.equal(
    formatDescription("See https://en.wikipedia.org/wiki/Open_source_(software) for details."),
    "See [Event link](https://en.wikipedia.org/wiki/Open_source_(software)) for details.",
  );
  assert.equal(
    formatDescription("Paper (https://www.nature.com/articles/d41586-026-02451-2). Thanks!"),
    "Paper ([Event link](https://www.nature.com/articles/d41586-026-02451-2)). Thanks!",
  );
});

test("formatDescription generates valid Markdown links without unwanted backslashes", () => {
  const input =
    "Sign up (https://forms.gle/fKjzxbKFScfAMxks5) now and visit https://example.com/event?id=123.";
  const output = formatDescription(input);
  assert.equal(
    output,
    "Sign up ([Event link](https://forms.gle/fKjzxbKFScfAMxks5)) now and visit [Event link](https://example.com/event?id=123).",
  );
  assert.ok(!output.includes("\\("), "Generated Markdown links must not contain backslash-escaped parentheses");
  assert.ok(!output.includes("\\:"), "Generated Markdown links must not contain backslash-escaped colons");
});

test("formatDescription separates concatenated sentences and missing whitespace safely", () => {
  // Berkeley October/November meetup sentence concatenation
  assert.equal(
    formatDescription(
      "Join us to explore how we can harness the collective intelligence and creativity of the global open source ecosystem to meaningfully transform how knowledge is created and sharedCheck out the rest of the series (https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo)!",
    ),
    "Join us to explore how we can harness the collective intelligence and creativity of the global open source ecosystem to meaningfully transform how knowledge is created and shared. Check out the rest of the series ([Event link](https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo))!",
  );

  // Berkeley November meetup: period before parenthetical remark
  assert.equal(
    formatDescription("join us at 3:30pm.(event details coming soon!)"),
    "join us at 3:30pm. (event details coming soon!)",
  );

  // Existing sentence with proper separator is not duplicated
  assert.equal(
    formatDescription(
      "Knowledge is created and shared. Check out the rest of the series (https://example.com)!",
    ),
    "Knowledge is created and shared. Check out the rest of the series ([Event link](https://example.com))!",
  );

  // Normal descriptions and inline code/links remain unchanged
  assert.equal(
    formatDescription("Regular sentence with `inline.code(test)` and [Custom](https://example.com) link."),
    "Regular sentence with `inline.code(test)` and [Custom](https://example.com) link.",
  );

  // Paragraph and list formatting preserved
  assert.equal(
    formatDescription("First paragraph.\n\n- Item 1\n- Item 2\n\nSubsequent paragraph."),
    "First paragraph.\n\n- Item 1\n- Item 2\n\nSubsequent paragraph.",
  );
});

test("formatDescription inserts whitespace between closing link parenthesis and adjacent word", () => {
  // Berkeley meetup: parenthetical URL concatenated with following prose
  assert.equal(
    formatDescription(
      "Visit (https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo)the OSPO page (https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo) for more OSPO info and events.",
    ),
    "Visit ([Event link](https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo)) the OSPO page ([Event link](https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo)) for more OSPO info and events.",
  );

  // Already-formatted markdown link followed immediately by text
  assert.equal(
    formatDescription("Visit ([Event link](https://bids.berkeley.edu/ospo))the OSPO page."),
    "Visit ([Event link](https://bids.berkeley.edu/ospo)) the OSPO page.",
  );
  assert.equal(
    formatDescription("Visit [the site](https://example.com)for info."),
    "Visit [the site](https://example.com) for info.",
  );
  assert.equal(
    formatDescription("Check [Event link](https://example.com)the page."),
    "Check [Event link](https://example.com) the page.",
  );

  // General parenthetical URL concatenated with word
  assert.equal(
    formatDescription("Read docs (https://example.com/guide)carefully before starting."),
    "Read docs ([Event link](https://example.com/guide)) carefully before starting.",
  );

  // Parenthesized URL that itself contains parentheses followed by word
  assert.equal(
    formatDescription("See (https://en.wikipedia.org/wiki/Open_source_(software))the article."),
    "See ([Event link](https://en.wikipedia.org/wiki/Open_source_(software))) the article.",
  );

  // Inline code with parens and adjacent letters must not be modified
  assert.equal(
    formatDescription("Code `fn(x)y` and `test(1)foo` stay intact."),
    "Code `fn(x)y` and `test(1)foo` stay intact.",
  );

  // Idempotence: repeated formatting produces identical results
  const rawBerkeley =
    "Visit (https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo)the OSPO page (https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo) for more OSPO info and events.";
  const pass1 = formatDescription(rawBerkeley);
  const pass2 = formatDescription(pass1);
  assert.equal(
    pass1,
    "Visit ([Event link](https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo)) the OSPO page ([Event link](https://bids.berkeley.edu/programs-initiatives/open-source-program-office-ospo)) for more OSPO info and events.",
  );
  assert.equal(pass2, pass1);
});

test("formatUpcomingMarkdown preserves registration URLs and converts description URL labels", () => {
  const e = ev("ucla", {
    id: "url-test",
    title: "Link Test Event",
    start: new Date("2026-10-20T19:00:00Z"),
    description: "Visit [https://example.com](https://example.com) or join https://zoom.us/j/123.",
    url: "https://registration.example.edu/event?id=123",
  });

  const md = formatUpcomingMarkdown([e]);
  assert.ok(md.includes("Visit [Event link](https://example.com)"));
  assert.ok(md.includes("or join [Event link](https://zoom.us/j/123)."));
  // Registration button must remain intact
  assert.ok(md.includes("[Register here](https://registration.example.edu/event?id=123)"));
});

test("formatHeadingTitle preserves titles occurring once and disambiguates duplicates with date", () => {
  const seen = new Set();
  const e1 = ev("ucsb", {
    id: "lounge-1",
    title: "Open Source Lounge",
    start: new Date("2026-10-16T10:00:00Z"),
  });
  const e2 = ev("ucsb", {
    id: "lounge-2",
    title: "Open Source Lounge",
    start: new Date("2026-10-23T10:00:00Z"),
  });
  const single = ev("davis", {
    id: "symposium",
    title: "Data Science Symposium",
    start: new Date("2026-10-25T18:00:00Z"),
  });

  assert.equal(formatHeadingTitle(e1, seen), "Open Source Lounge");
  assert.equal(formatHeadingTitle(e2, seen), "Open Source Lounge (October 23, 2026)");
  assert.equal(formatHeadingTitle(single, seen), "Data Science Symposium");

  // Missing and invalid start dates on duplicate events fall back safely
  const seenMissing = new Set();
  const eMissing1 = { title: "Workshop", start: null };
  const eMissing2 = { title: "Workshop", start: new Date("invalid") };
  const eMissing3 = { title: "Workshop", start: undefined };
  assert.equal(formatHeadingTitle(eMissing1, seenMissing), "Workshop");
  assert.equal(formatHeadingTitle(eMissing2, seenMissing), "Workshop (2)");
  assert.equal(formatHeadingTitle(eMissing3, seenMissing), "Workshop (3)");
});

test("duplicate titles repeated in different months are disambiguated and all headings remain unique", () => {
  const events = [
    ev("ucsb", {
      id: "lounge-oct-1",
      title: "Open Source Lounge",
      start: new Date("2026-10-16T10:00:00Z"),
    }),
    ev("ucsb", {
      id: "lounge-oct-2",
      title: "Open Source Lounge",
      start: new Date("2026-10-23T10:00:00Z"),
    }),
    ev("network", {
      id: "unique-keynote",
      title: "All-Campus Keynote",
      start: new Date("2026-10-28T18:00:00Z"),
    }),
    ev("network", {
      id: "orb-nov-1",
      title: "ORB Community Call",
      start: new Date("2026-11-03T20:00:00Z"),
    }),
    ev("network", {
      id: "orb-nov-2",
      title: "ORB Community Call",
      start: new Date("2026-11-04T10:30:00Z"),
    }),
    ev("ucsb", {
      id: "lounge-nov",
      title: "Open Source Lounge",
      start: new Date("2026-11-06T11:00:00Z"),
    }),
    ev("network", {
      id: "orb-dec",
      title: "ORB Community Call",
      start: new Date("2026-12-01T20:00:00Z"),
    }),
  ];

  const md = formatUpcomingMarkdown(events);

  // Single occurrence must preserve original title without date
  assert.ok(md.includes("#### All-Campus Keynote"));
  assert.ok(!md.includes("#### All-Campus Keynote ("));

  // First occurrence of repeated title preserves original title
  assert.ok(md.includes("#### Open Source Lounge\n"));
  assert.ok(md.includes("#### ORB Community Call\n"));

  // Subsequent occurrences in same or different months get dates
  assert.ok(md.includes("#### Open Source Lounge (October 23, 2026)"));
  assert.ok(md.includes("#### Open Source Lounge (November 6, 2026)"));
  assert.ok(md.includes("#### ORB Community Call (November 4, 2026)"));
  assert.ok(md.includes("#### ORB Community Call (December 1, 2026)"));

  // Confirm that every generated heading in the output is unique
  const headings = [...md.matchAll(/^#{3,4}\s+(.+)$/gm)].map((m) => m[1]);
  const uniqueHeadings = new Set(headings);
  assert.equal(uniqueHeadings.size, headings.length, "All H3/H4 headings must be strictly unique");
});
