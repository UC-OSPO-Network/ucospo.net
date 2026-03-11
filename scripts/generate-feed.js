#!/usr/bin/env node
// Generates atom.xml from blog posts and writes it to _build/html/atom.xml

import { Feed } from "feed";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SITE_URL = "https://ucospo.net";

const feed = new Feed({
  title: "UC OSPO Network",
  description:
    "News and updates from the UC Open Source Program Office Network",
  id: SITE_URL + "/",
  link: SITE_URL + "/",
  language: "en",
  feedLinks: { atom: SITE_URL + "/atom.xml" },
  copyright: `UC OSPO Network ${new Date().getFullYear()}`,
});

// Collect post files: posts/*.md (not index.md) and posts/*/index.md
const postsDir = path.join(ROOT, "posts");
const items = [];

for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
  let filePath;
  if (entry.isDirectory()) {
    filePath = path.join(postsDir, entry.name, "index.md");
  } else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
    filePath = path.join(postsDir, entry.name);
  } else {
    continue;
  }

  if (!fs.existsSync(filePath)) continue;

  const { data } = matter(fs.readFileSync(filePath, "utf-8"));
  if (!data.date || !data.title) continue;

  // Build URL: posts/foo/index.md -> /posts/foo, posts/foo.md -> /posts/foo
  const slug = entry.isDirectory()
    ? entry.name
    : entry.name.replace(/\.md$/, "");
  const url = `${SITE_URL}/posts/${slug}`;

  const authors = data.authors
    ? data.authors.map((a) => ({ name: typeof a === "string" ? a : a.name }))
    : data.author
      ? [{ name: data.author }]
      : [];

  items.push({
    title: data.title,
    id: url,
    link: url,
    description: data.description || "",
    date: new Date(data.date),
    author: authors,
  });
}

// Sort newest first
items.sort((a, b) => b.date - a.date);
items.forEach((item) => feed.addItem(item));

const outDir = path.join(ROOT, "_build", "html");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, "atom.xml"), feed.atom1());
console.log(`Generated atom.xml with ${items.length} items`);
