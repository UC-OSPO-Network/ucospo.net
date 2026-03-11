#!/usr/bin/env python3
"""Regenerate posts/index.md from post frontmatter.

Usage:
    python scripts/build_blog_index.py

Scans posts/ for markdown files, reads their frontmatter, and rewrites
posts/index.md with a card grid sorted newest-first.
"""

import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
POSTS_DIR = REPO_ROOT / "posts"
INDEX_FILE = POSTS_DIR / "index.md"
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}

HEADER = """\
---
title: Blog
site:
    hide_footer_links: true
---

# Blog

::::{div} blog-cards
:::{grid} 1 2 3 3
"""

FOOTER = "\n:::\n::::\n"


def parse_frontmatter(path: Path) -> dict:
    """Extract YAML frontmatter from a markdown file without dependencies."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    end = text.index("---", 3)
    fm_text = text[3:end]
    result = {}
    for line in fm_text.splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            result[key.strip()] = val.strip().strip('"')
    return result


def find_image(post_dir: Path, post_file: Path) -> str | None:
    """Return the first image found next to the post, relative to posts/."""
    for f in sorted(post_dir.iterdir()):
        if f.suffix.lower() in IMAGE_EXTENSIONS and f != post_file:
            return str(f.relative_to(POSTS_DIR))
    return None


def collect_posts() -> list[dict]:
    """Collect and return all posts sorted newest-first."""
    posts = []
    for md in POSTS_DIR.rglob("*.md"):
        if md.name == "index.md" and md.parent == POSTS_DIR:
            continue  # skip the index itself
        fm = parse_frontmatter(md)
        if "title" not in fm or "date" not in fm:
            continue

        image = find_image(md.parent, md)

        # URL path for the card link
        rel = md.relative_to(POSTS_DIR)
        slug = str(rel.parent) if rel.name == "index.md" else str(rel.with_suffix(""))
        url = f"/posts/{slug}"

        try:
            post_date = date.fromisoformat(str(fm["date"]))
        except ValueError:
            continue

        posts.append({
            "title": fm["title"],
            "date": post_date,
            "description": fm.get("description", ""),
            "url": url,
            "image": image,
        })

    return sorted(posts, key=lambda p: p["date"], reverse=True)


def format_date(d: date) -> str:
    """Format a date as 'Month D, YYYY'."""
    return d.strftime("%B %-d, %Y")


def render_card(post: dict) -> str:
    """Render a single card block for a post."""
    lines = [
        f"::{{card}} {post['title']}",
        f":link: {post['url']}",
        f":footer: {format_date(post['date'])}",
        "",
    ]
    if post["image"]:
        lines.append(f"![{post['title']}]({post['image']})")
        lines.append("")
    lines.append(post["description"])
    lines.append(":::")
    return "\n".join(lines)


def main():
    """Write posts/index.md."""
    posts = collect_posts()
    if not posts:
        print("No posts found.", file=sys.stderr)
        sys.exit(1)

    cards = "\n\n".join(render_card(p) for p in posts)
    INDEX_FILE.write_text(HEADER + "\n" + cards + FOOTER, encoding="utf-8")
    print(f"Wrote {len(posts)} cards to {INDEX_FILE.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
