#!/usr/bin/env python3
"""Deterministically unwrap hard-wrapped prose in Markdown.

One paragraph = one line. One list item = one line. Reviews then show only the
lines that really changed.

Runs as a local pre-commit hook (see `.pre-commit-config.yaml`), so a PR that
arrives hard-wrapped can be fixed by commenting `pre-commit.ci autofix`.
No dependencies beyond the standard library.

Usage:
    python3 unwrap_prose.py FILE [FILE ...]        # rewrite in place
    python3 unwrap_prose.py --check FILE [...]     # report only, exit 1 if wrapped
    python3 unwrap_prose.py --diff FILE [...]      # print a unified diff, write nothing

Preserved verbatim (never joined):
    YAML frontmatter, fenced code blocks (``` and ~~~), indented code blocks,
    headings, table rows, fenced-div markers (:::), horizontal rules, HTML
    blocks, link-reference definitions, and explicit hard breaks (a line
    ending in two spaces or a backslash).
    MyST: directive option lines (`:class: dropdown`), `%` comments,
    `(label)=` targets, `+++` block breaks and `$$` math fences. Backtick
    directives (```{figure}) are fences, so their bodies are left as they are.

Joined:
    consecutive prose lines within a paragraph; continuation lines of a list
    item; consecutive lines within a blockquote paragraph.
"""

import argparse
import difflib
import re
import sys

FENCE = re.compile(r"^\s{0,3}(`{3,}|~{3,})")
# A fence closes only on a line of the same character, at least as long as the
# opener, with nothing after it (CommonMark). MyST nests directives in longer
# fences (````{list-table} holding ```{image}), so an inner ``` must not close
# the outer block.
FENCE_CLOSE = re.compile(r"^\s*(`{3,}|~{3,})\s*$")
HEADING = re.compile(r"^\s{0,3}#{1,6}\s")
SETEXT = re.compile(r"^\s{0,3}(=+|-{2,})\s*$")
HRULE = re.compile(r"^\s{0,3}([-*_])(\s*\1){2,}\s*$")
TABLE = re.compile(r"^\s*\|")
DIV = re.compile(r"^\s*:{3,}")
LIST = re.compile(r"^(\s*)([-*+]|\d{1,9}[.)])(\s+)(.*)$")
QUOTE = re.compile(r"^(\s*>+\s?)(.*)$")
HTML = re.compile(r"^\s{0,3}<[a-zA-Z/!]")
LINKDEF = re.compile(r"^\s{0,3}\[[^\]]+\]:\s")
INDENTED_CODE = re.compile(r"^(\t|    )")
HARD_BREAK = re.compile(r"(  |\\)$")
# MyST. An option line inside a colon-fence directive must stay on its own line,
# or `:class: dropdown` gets merged into the body text. A `%` comment joined to
# the prose after it would comment that prose out of the page.
MYST_OPTION = re.compile(r"^\s*:[A-Za-z][\w-]*:(\s|$)")
MYST_COMMENT = re.compile(r"^\s*%")
MYST_TARGET = re.compile(r"^\s*\([^)]+\)=\s*$")
MYST_BREAK = re.compile(r"^\s*(\+\+\+|\$\$)")
# A line beginning with a bold label ("**Time:** ...", "**Where**: ...") starts its
# own logical line. Runs of these are metadata blocks, not wrapped paragraphs, and
# joining them produces a run-on. This is checked against the NEXT line only, so it
# stops a bold-label line being absorbed into the previous paragraph. A paragraph
# that merely opens with a bold lead-in and then wraps into plain prose still joins
# correctly, because the check never fires on the paragraph's own first line.
BOLD_LABEL = re.compile(r"^\s{0,3}\*\*[^*\n]+?\*\*\s*:?\s")
# Obsidian/MyST callout header: "> [!warning] Optional title". The header is its
# own line and the body follows on the next; joining them destroys the callout.
CALLOUT = re.compile(r"^\s*\[!\w+\]")
# A whole-line italic run ("_Saved: ..._") is a metadata line, same family as
# BOLD_LABEL. The handoff template uses these, and joining them makes a run-on.
ITALIC_LINE = re.compile(r"^\s{0,3}_[^_\n]+_\s*$")


def _keep_break(joined, raw_last):
    """Re-attach a two-space hard break that rstrip() would have eaten.

    A trailing backslash survives rstrip, but two trailing spaces do not, and
    dropping them silently changes how the Markdown renders.
    """
    if raw_last.endswith("  ") and not joined.endswith("  "):
        return joined + "  "
    return joined


def _is_block_start(line):
    """A line that must begin its own logical line."""
    return bool(
        not line.strip()
        or FENCE.match(line)
        or HEADING.match(line)
        or HRULE.match(line)
        or TABLE.match(line)
        or DIV.match(line)
        or HTML.match(line)
        or LINKDEF.match(line)
        or SETEXT.match(line)
        or MYST_OPTION.match(line)
        or MYST_COMMENT.match(line)
        or MYST_TARGET.match(line)
        or MYST_BREAK.match(line)
    )


def unwrap(text):
    lines = text.split("\n")
    out = []
    i = 0
    n = len(lines)

    # YAML frontmatter passes through untouched.
    if n and lines[0].strip() == "---":
        out.append(lines[0])
        i = 1
        while i < n and lines[i].strip() != "---":
            out.append(lines[i])
            i += 1
        if i < n:
            out.append(lines[i])
            i += 1

    in_fence = False
    fence_marker = None
    # Inside a list, a nested item indented 4+ spaces is still a list item, not
    # an indented code block (CONTRIBUTING.md nests its steps that way).
    in_list = False

    while i < n:
        line = lines[i]

        if in_fence:
            out.append(line)
            close = FENCE_CLOSE.match(line)
            if (
                close
                and close.group(1)[0] == fence_marker[0]
                and len(close.group(1)) >= len(fence_marker)
            ):
                in_fence = False
                fence_marker = None
            i += 1
            continue

        m = FENCE.match(line)
        if m:
            in_fence = True
            fence_marker = m.group(1)
            out.append(line)
            i += 1
            continue

        nested_item = in_list and LIST.match(line)
        if _is_block_start(line) or (INDENTED_CODE.match(line) and not nested_item):
            if line.strip() and not line[0].isspace():
                in_list = False
            out.append(line)
            i += 1
            continue

        # Blockquote paragraph: join following quote lines.
        q = QUOTE.match(line)
        if q:
            prefix, first = q.group(1), q.group(2)
            # A callout header stands alone; emit it and let the body start fresh.
            if CALLOUT.match(first):
                out.append(prefix + first.rstrip())
                i += 1
                continue
            parts = [first.rstrip()]
            raw_last = first
            i += 1
            while i < n:
                nxt = QUOTE.match(lines[i])
                if not nxt or not nxt.group(2).strip():
                    break
                if HARD_BREAK.search(raw_last):
                    break
                if _is_block_start(nxt.group(2)) or LIST.match(nxt.group(2)):
                    break
                parts.append(nxt.group(2).strip())
                raw_last = nxt.group(2)
                i += 1
            out.append(_keep_break(prefix + " ".join(p for p in parts if p), raw_last))
            continue

        # List item: absorb continuation lines (indented, not a new item).
        li = LIST.match(line)
        if li:
            in_list = True
            indent, bullet, gap, rest = li.groups()
            parts = [rest.rstrip()]
            raw_last = rest
            i += 1
            while i < n:
                nxt = lines[i]
                if not nxt.strip() or _is_block_start(nxt) or LIST.match(nxt):
                    break
                if HARD_BREAK.search(raw_last):
                    break
                if not nxt.startswith(" ") and not nxt.startswith("\t"):
                    break
                if (
                    INDENTED_CODE.match(nxt)
                    and len(nxt) - len(nxt.lstrip()) > len(indent) + 4
                ):
                    break
                parts.append(nxt.strip())
                raw_last = nxt
                i += 1
            out.append(
                _keep_break(
                    f"{indent}{bullet}{gap}" + " ".join(p for p in parts if p), raw_last
                )
            )
            continue

        # Plain paragraph.
        if not line[0].isspace():
            in_list = False
        parts = [line.rstrip()]
        raw_last = line
        i += 1
        while i < n:
            nxt = lines[i]
            if (
                not nxt.strip()
                or _is_block_start(nxt)
                or LIST.match(nxt)
                or QUOTE.match(nxt)
            ):
                break
            if BOLD_LABEL.match(nxt) or ITALIC_LINE.match(nxt):
                break
            if HARD_BREAK.search(raw_last):
                break
            if INDENTED_CODE.match(nxt):
                break
            parts.append(nxt.strip())
            raw_last = nxt
            i += 1
        out.append(_keep_break(" ".join(p for p in parts if p), raw_last))

    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("files", nargs="+")
    g = ap.add_mutually_exclusive_group()
    g.add_argument(
        "--check",
        action="store_true",
        help="report only; exit 1 if any file is wrapped",
    )
    g.add_argument(
        "--diff", action="store_true", help="print a unified diff; write nothing"
    )
    args = ap.parse_args()

    dirty = False
    for path in args.files:
        try:
            original = open(path, encoding="utf-8").read()
        except OSError as e:
            print(f"error: {e}", file=sys.stderr)
            dirty = True
            continue
        fixed = unwrap(original)
        if fixed == original:
            continue
        dirty = True
        if args.check:
            n = sum(
                1 for a, b in zip(original.split("\n"), fixed.split("\n")) if a != b
            )
            print(f"hard-wrapped: {path} ({n} lines differ)")
        elif args.diff:
            sys.stdout.writelines(
                difflib.unified_diff(
                    original.splitlines(keepends=True),
                    fixed.splitlines(keepends=True),
                    fromfile=path,
                    tofile=path + " (unwrapped)",
                )
            )
        else:
            open(path, "w", encoding="utf-8").write(fixed)
            print(f"unwrapped: {path}")

    if args.check and dirty:
        sys.exit(1)


if __name__ == "__main__":
    main()
