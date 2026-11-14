import { test } from "node:test";
import assert from "node:assert/strict";
import { stripHtml } from "./sources.js";

test("stripHtml decodes decimal numeric entities", () => {
  assert.equal(stripHtml("It&#8217;s an event"), "It’s an event");
  assert.equal(stripHtml("Price &#36;10 and apostrophe &#39; or &#039;"), "Price $10 and apostrophe ' or '");
  assert.equal(stripHtml("En-dash &#8211; Em-dash &#8212;"), "En-dash – Em-dash —");
  assert.equal(stripHtml("Accented: caf&#233;"), "Accented: café");
});

test("stripHtml decodes hexadecimal numeric entities", () => {
  assert.equal(stripHtml("It&#x2019;s an event"), "It’s an event");
  assert.equal(stripHtml("Hex apostrophe &#x27; and dash &#x2014;"), "Hex apostrophe ' and dash —");
  assert.equal(stripHtml("Accented hex: caf&#xe9; or caf&#xE9;"), "Accented hex: café or café");
  assert.equal(stripHtml("Case of x: &#x41; and &#X41;"), "Case of x: A and A");
});

test("stripHtml decodes commonly encountered named HTML entities", () => {
  assert.equal(stripHtml("Break &mdash; pause &ndash; more"), "Break — pause – more");
  assert.equal(stripHtml("Waiting&hellip;"), "Waiting…");
  assert.equal(stripHtml("Copyright &copy; 2026 &reg; &trade;"), "Copyright © 2026 ® ™");
  assert.equal(stripHtml("&ldquo;Quotes&rdquo; and &lsquo;single&rsquo;"), "“Quotes” and ‘single’");
  assert.equal(stripHtml("Bullets &bull; and spaces&nbsp;here"), "Bullets • and spaces here");
  assert.equal(stripHtml("Math: 5 &times; 2 &divide; 2 &plusmn; 1"), "Math: 5 × 2 ÷ 2 ± 1");
  assert.equal(stripHtml("Symbols: &amp; &lt; &gt; &quot; &apos;"), "Symbols: & < > \" '");
});

test("stripHtml respects case-sensitivity for named entities and handles explicit uppercase aliases", () => {
  // Case-sensitive distinctions: single vs double
  assert.equal(stripHtml("Footnote: &dagger; vs &Dagger;"), "Footnote: † vs ‡");
  assert.equal(stripHtml("Minutes &prime; and seconds &Prime;"), "Minutes ′ and seconds ″");

  // Explicit uppercase aliases vs standard lowercase
  assert.equal(stripHtml("Ampersand: &amp; and &AMP;"), "Ampersand: & and &");
  assert.equal(stripHtml("Brackets: &lt; &LT; and &gt; &GT;"), "Brackets: < < and > >");

  // Unrecognized uppercase variants remain unchanged (no incorrect lowercase fallback)
  assert.equal(stripHtml("&DAGGER; and &PRIME;"), "&DAGGER; and &PRIME;");
});

test("stripHtml prevents double decoding", () => {
  assert.equal(stripHtml("&amp;lt;"), "&lt;");
  assert.equal(stripHtml("&amp;#39;"), "&#39;");
  assert.equal(stripHtml("&amp;amp;"), "&amp;");
  assert.equal(stripHtml("&amp;mdash;"), "&mdash;");
  assert.equal(stripHtml("Nested: &amp;quot;hello&amp;quot;"), "Nested: &quot;hello&quot;");
});

test("stripHtml preserves unknown entities without crashing", () => {
  assert.equal(stripHtml("&unknownentity; &foo;"), "&unknownentity; &foo;");
});

test("stripHtml handles invalid code points without crashing", () => {
  // Out of Unicode range
  assert.equal(stripHtml("&#99999999; &#x110000;"), "&#99999999; &#x110000;");
  // Surrogates
  assert.equal(stripHtml("&#xD800; &#55296;"), "&#xD800; &#55296;");
  // Zero / negative
  assert.equal(stripHtml("&#0; &#-1;"), "&#0; &#-1;");
});

test("stripHtml preserves HTML stripping and structural formatting", () => {
  const html = "<p>First paragraph</p><p>Second paragraph with <br/>line break and <b>bold</b></p><ul><li>Item 1</li><li>Item 2</li></ul>";
  const expected = "First paragraph\nSecond paragraph with\nline break and bold\n- Item 1\n- Item 2";
  assert.equal(stripHtml(html), expected);
});

test("stripHtml returns null for empty or whitespace-only inputs", () => {
  assert.equal(stripHtml(null), null);
  assert.equal(stripHtml(""), null);
  assert.equal(stripHtml("   <p></p>   "), null);
});
