# ucospo.net

The [UC OSPO Network](https://ucospo.net) website, built with [MyST](https://mystmd.org).

## Prerequisites

- [Node.js](https://nodejs.org) v20+ and npm
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

Pre-commit hooks run Prettier, Black, and codespell automatically before each commit. To enable them, first create a Python virtual environment and install the hook:

```bash
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pre-commit install
```

If you skip this step, the `pre-commit.ci` bot will check your PR automatically instead.

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

- Pages are [MyST Markdown](https://mystmd.org/guide/quickstart-myst-documents).
- The table of contents is defined in `myst.yml` under `project.toc`.
  Add new pages there as well as creating the `.md` file.
- Blog post frontmatter uses `tags` as an array: `tags: [tag1, tag2]`.
- Admonitions use MyST syntax: `:::{note}`, `:::{tip}`, `:::{important}`.

## Linting and formatting

This project uses [pre-commit](https://pre-commit.com) with Prettier, Black, and codespell.

Run all hooks against staged files:

```bash
pre-commit run
```

Run against all files:

```bash
pre-commit run --all-files
```

If you push without running pre-commit locally, the `pre-commit.ci` bot will check
your PR automatically. To have it push fixes, comment `pre-commit.ci autofix` on the PR.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution workflow including
forking, branching, and the PR review process.
