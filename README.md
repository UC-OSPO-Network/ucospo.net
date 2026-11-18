# ucospo.net

The [UC OSPO Network](https://ucospo.net) website, built with [MyST](https://mystmd.org).

## Prerequisites

- [Node.js](https://nodejs.org) and npm. Use the version in [`.nvmrc`](.nvmrc) (run `nvm use`); Node 24.17.0+ currently breaks the accessibility check due to an upstream regression.
- [Python](https://www.python.org) 3.10+ (optional, for pre-commit hooks)

## Local development

### 1. Clone the repo

```bash
git clone git@github.com:UC-OSPO-Network/ucospo.net.git
cd ucospo.net
```

### 2. Install dependencies

```bash
npm install
```

### 3. (Optional) Set up pre-commit hooks

Pre-commit hooks run Prettier, markdownlint, Black, and codespell automatically before each commit. To enable them, first create a Python virtual environment and install the hook:

```bash
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pre-commit install
```

If you skip this step, the `pre-commit.ci` bot will check your PR automatically instead. [CONTRIBUTING.md](CONTRIBUTING.md#quickstart-for-experienced-contributors) explains what the hooks check and how to fix failures.

### 4. Preview the site

```bash
make serve
# or: npx myst start
```

This starts a live-reload dev server, typically at <http://localhost:3000>.

### 5. Build a static copy

```bash
make html
# or: npx myst build --html
```

Output goes to `_build/html/`.

### 6. Run the checks

See [the checks CI runs](CONTRIBUTING.md#development-workflow) in CONTRIBUTING.md.

## Project structure

```text
myst.yml          # site config and table of contents
index.md          # home page
about.md          # about page
news.md           # news page
campus/           # per-campus pages
events/           # event pages
guiding-themes/   # guiding themes section
oss-resources/    # open source resource guides
posts/            # blog posts
static/          # images, CSS, and other static assets
```

## Content conventions

See [Follow the content conventions](CONTRIBUTING.md#follow-the-content-conventions) in CONTRIBUTING.md.

## Writing a blog post

Blog posts live in `posts/`. Each post is a folder containing an `index.md` plus any images it uses. Adding a post involves creating the post itself and then registering it in a few places so it appears in the site's navigation, blog index, and news feed.

### 1. Create the post

Make a folder named with the post's URL slug and add an `index.md`:

```text
posts/my-post-slug/index.md
```

Start it with frontmatter:

```yaml
---
date: 2026-06-16
title: "Your Post Title"
description: "One-sentence summary used on the blog card and in the Atom feed."
author: Author Name
tags: [tag1, tag2] # optional
---
```

- `date` (required) drives the newest-first ordering everywhere. Use `YYYY-MM-DD`.
- `title` and `description` (required) are reused on the blog index card and in the Atom feed.
- For multiple authors, use a list instead of `author`:

  ```yaml
  authors:
    - First Author
    - Second Author
  ```

- Put images in the same folder as the post and reference them by filename (e.g. `![Alt text](my-image.png)` or a `:::{figure}` directive). Include descriptive alt text, which both markdownlint and pa11y-ci check for.

### 2. Register the post

Update these three files so the post is linked from the rest of the site:

| File             | What to add                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| `posts/index.md` | A `:::{card}` block linking to `/posts/my-post-slug`, newest-first.                 |
| `myst.yml`       | A `- file: posts/my-post-slug/index.md` entry under the Blog section, newest-first. |
| `news.md`        | A short heading and a line linking to the post (only if it's newsworthy).           |

Copy an existing entry in each file and adjust the title, link, and date.

### 3. What updates automatically

You do **not** need to touch these; they regenerate from post frontmatter at build time:

- **Atom feed** (`scripts/generate-feed.js`, run during `make html`): picks up any `posts/*/index.md` that has a `date` and `title`.
- **Sitemap**: MyST generates `_build/html/sitemap.xml` on build.

### 4. Preview and check

Run `make serve` and confirm the post renders, appears on the blog index, and is linked from the sidebar nav. `make check` (step 6 of [Local development](#local-development)) catches broken links and missing alt text before you open a PR.

## CI and deployment

The site's production build is deployed to [GitHub Pages](https://pages.github.com) via GitHub Actions.

**On push to `main`:** `.github/workflows/deploy.yml` builds the site with `make html` and publishes it to the `UC-OSPO-Network.github.io` repo (also on a 12-hour schedule, to keep the aggregated event feeds current).

**On pull requests:** `.github/workflows/pr.yml` runs `make check`, and pre-commit.ci runs the pre-commit hooks. Branch PRs also get a **Netlify deploy preview** (built from `netlify.toml`, linked from the PR's checks); fork PRs get the checks but not the preview. The Netlify preview is not production. [CONTRIBUTING.md](CONTRIBUTING.md#development-workflow) lists what each check catches.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution workflow including
forking, branching, and the PR review process.
