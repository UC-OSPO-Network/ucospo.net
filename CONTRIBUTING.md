# Contributor Guide

Thank you for investing your time in contributing to our project!

Every pull request takes a maintainer's time to read, test, and decide on. This guide follows a contribution from start to finish, and it's also what we check when we review, so following it makes your PR quicker to merge. It applies to everyone, maintainers included, whether you write every line yourself or work with an AI tool.

New to open source? These GitHub guides cover the basics:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Table of contents

- [Choose what to work on](#choose-what-to-work-on)
- [Set up your copy](#set-up-your-copy)
- [Make your change](#make-your-change)
  - [Project structure](#project-structure)
  - [Follow the content conventions](#follow-the-content-conventions)
  - [Make it right for the site, not just correct](#make-it-right-for-the-site-not-just-correct)
  - [Writing a blog post](#writing-a-blog-post)
  - [Keep the diff focused](#keep-the-diff-focused)
- [Check your change](#check-your-change)
- [Open your pull request](#open-your-pull-request)
- [Keep your branch up to date](#keep-your-branch-up-to-date)

## Choose what to work on

Most of the PRs we close aren't wrong line by line. They fix something nobody runs into.

- **Start from an issue.** The surest way to find work we want is an open issue a maintainer filed. Issues labeled `good first issue` or `help wanted` are good places to start; `internal-only` issues are for people in the UC OSPO Network. Comment on the issue before you begin, so we can confirm it's still wanted.
- **Search first, closed issues and PRs included.** If an earlier PR was closed, read why before proposing the same thing.
- **Name who runs into the problem:** a visitor to a page that's in the nav or linked from other pages, someone following this guide or the README, or a maintainer running CI or the build. If you can't name anyone, it probably doesn't need fixing.
- **Check that the thing is still in use.** Before fixing a script, page, or function, confirm something still uses it: for a script, does the Makefile, CI, or this guide run it? For a page, is it linked anywhere? If nothing uses it, open an issue asking whether it should be removed, rather than fixing it.
- **Check that it's actually broken.** A dead link, a crash on a path people take, or wrong information is broken. Wording you'd phrase differently, a style you'd prefer, or a case that hasn't come up isn't.
- **Leave working safeguards alone.** A check that fails loudly and tells you exactly how to fix your input is doing its job.
- **New pages and posts** come from the network. If you're part of the UC OSPO Network or writing on its behalf, go ahead ([Writing a blog post](#writing-a-blog-post) covers posts). Otherwise, suggest new content in an issue first.
- **Ask before maintainer-sized work.** Library swaps, major dependency upgrades, and repo-wide refactors are maintainer decisions. Raise them in an issue first.

## Set up your copy

### Prerequisites

- [Node.js](https://nodejs.org) and npm. Use the version in [`.nvmrc`](.nvmrc) (run `nvm use`); Node 24.17.0+ currently breaks the accessibility check due to an upstream regression.
- [Python](https://www.python.org) 3.10+ (optional, for pre-commit hooks)

### 1. Fork and clone

- Go to <https://github.com/UC-OSPO-Network/ucospo.net/> and click the "fork" button to create your own copy of the project.

- Clone the project to your local computer:

  ```bash
  git clone git@github.com:UC-OSPO-Network/ucospo.net.git
  ```

- Navigate to your `ucospo.net` and add your personal GitHub repository:

  ```bash
  git remote add <your-username> git@github.com:<your-username>/ucospo.net.git
  ```

- Now, you have remote repositories named:
  - `origin`, which refers to the `UC-OSPO-Network/ucospo.net` repository
  - `<your-username>`, which refers to your personal fork of `UC-OSPO-Network/ucospo.net`

### 2. Install dependencies

```bash
npm install
```

### 3. (Optional) Set up pre-commit hooks

Pre-commit hooks run the formatting, lint, and typo checks automatically before each commit. To enable them, first create a Python virtual environment and install the hook:

```bash
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pre-commit install
```

If you skip this step, the `pre-commit.ci` bot will check your PR automatically instead. [Check your change](#check-your-change) explains what the hooks check and how to fix failures.

## Make your change

Pull the latest changes from upstream:

```bash
git switch main
git pull origin main
```

Create a branch for the feature you want to work on. Since the branch name will appear in the merge message, use a sensible name such as `bugfix-for-issue-1480`:

```bash
git switch -c bugfix-for-issue-1480
```

Commit locally as you progress (`git add` and `git commit`).

### Project structure

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

### Follow the content conventions

- **MyST first.** Pages are [MyST Markdown](https://mystmd.org/guide/quickstart-myst-documents). When native MyST can do the job (directives such as `{figure}`, `{image}`, `{card}`, `{grid}`, and `{div}`, roles, or frontmatter options), use it instead of raw HTML or custom CSS. Raw HTML elsewhere on the site isn't a reason to add more. Admonitions, for example, use `:::{note}`, `:::{tip}`, or `:::{important}`.
- **New pages go in the table of contents.** It's defined in `myst.yml` under `project.toc`; add the page there as well as creating the `.md` file. Blog posts have a few more steps; see [Writing a blog post](#writing-a-blog-post).
- **Blog post tags are an array** in frontmatter: `tags: [tag1, tag2]`.
- **Good alt text, not just alt text.** markdownlint only checks that it exists. Good alt text says what the image is for in context, doesn't start with "image of", includes any text that's in the image, and is empty (`alt=""`) for purely decorative images.
- **Link text that makes sense out of context** (no "click here").
- **Leave line wrapping as you find it.** Don't rewrap or unwrap paragraphs you aren't otherwise editing.
- **Don't edit generated output** (`_build/`, the Atom feed, the sitemap). It regenerates at build time.

### Make it right for the site, not just correct

If the obvious next step after merging your PR would be for a maintainer to remove or replace what you changed, it isn't the right change, however well the lines do what they claim.

- **Find every other use.** Search the repo for each function, selector, CSS class, config key, and file you change, and check what else your change reaches.
- **Don't trade a loud failure for a silent wrong answer.** When you widen what a pattern, regex, or check accepts, test what it now accepts that it shouldn't.
- **Don't weaken a check to make it pass.** It's very unlikely a "solution" will involve removing a linter or accessibility ignore, a test, or a timeout, or adding an ignore or deleting markup that a checker flags. Find out what the flagged thing was doing first. In the very rare case that such a change is justified, explain why in the PR description, and make sure the underlying problem is fixed rather than hidden.
- **Write down the why.** If you do something non-obvious (a workaround, the least-bad option, something a future contributor might "fix" back), explain it in a code comment next to it, or in this guide if contributors need to know it. PR descriptions and review comments are hard to find later. Keep existing comments that explain why something unusual is done; they're there for the next contributor.
- **Follow the existing pattern.** If you think there's a better way, say so in an issue rather than starting a second pattern.

### Writing a blog post

Blog posts live in `posts/`. Each post is a folder containing an `index.md` plus any images it uses. Adding a post involves creating the post itself and then registering it in a few places so it appears in the site's navigation, blog index, and news feed.

#### 1. Create the post

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

#### 2. Register the post

Update these three files so the post is linked from the rest of the site:

| File             | What to add                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| `posts/index.md` | A `:::{card}` block linking to `/posts/my-post-slug`, newest-first.                 |
| `myst.yml`       | A `- file: posts/my-post-slug/index.md` entry under the Blog section, newest-first. |
| `news.md`        | A short heading and a line linking to the post (only if it's newsworthy).           |

Copy an existing entry in each file and adjust the title, link, and date.

#### 3. What updates automatically

You do **not** need to touch these; they regenerate from post frontmatter at build time:

- **Atom feed** (`scripts/generate-feed.js`, run during `make html`): picks up any `posts/*/index.md` that has a `date` and `title`.
- **Sitemap**: MyST generates `_build/html/sitemap.xml` on build.

#### 4. Preview and check

Run `make serve` and confirm the post renders, appears on the blog index, and is linked from the sidebar nav. Then run the checks in [Check your change](#check-your-change), which catch broken links and missing alt text.

### Keep the diff focused

Keep the PR to one purpose: every change in the diff should be needed to resolve the linked issue. Leave out unrelated fixes, reformatting of lines you didn't otherwise change, and drive-by edits; open a separate issue or PR for those. That includes rewrapping, reindenting, reordering, or restyling anything you aren't otherwise editing. Before you push, read the whole diff and revert anything that isn't needed.

## Check your change

### Preview the site

```bash
make serve
# or: npx myst start
```

This starts a live-reload dev server, typically at <http://localhost:3000>. To build a static copy instead, run `make html` (or `npx myst build --html`); output goes to `_build/html/`.

If you open your PR from a branch in this repo (not a fork), a comment will appear after CI finishes with a link to a deploy preview of your changes.

### Prove it works

- **Ask which test would fail if your change didn't work.** If nothing you ran, and nothing CI runs, would fail, you haven't shown the change does anything. Add that test, with negative cases (inputs that should be rejected) as well as positive ones.
- **Run what you claim.** Only write "all tests pass" or "no change on other platforms" if you ran it, and say what you ran.
- **Run the change the way someone would meet it.** CI passing says nothing about a script CI never runs. For content, preview the site and look at the pages you touched.

### Run the checks

Every PR update runs these [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) checks, and they must pass before your PR can be merged:

| Check              | Tool                                                       | What it catches                                                                                                |
| ------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Unit tests         | `npm test`                                                 | Bugs in the events scripts, and events listed out of order                                                     |
| Build              | MyST                                                       | Broken Markdown, missing files, config errors                                                                  |
| Links              | [linkinator](https://github.com/JustinBeckwith/linkinator) | Broken internal and external links                                                                             |
| Accessibility      | [pa11y-ci](https://github.com/pa11y/pa11y-ci)              | WCAG 2.1 AA violations (contrast, alt text, etc.)                                                              |
| Linting/formatting | [pre-commit.ci](https://pre-commit.ci)                     | Formatting, Markdown structure, Python style, typos, and file hygiene (the hooks in `.pre-commit-config.yaml`) |

To run them yourself before you push:

- `make check` runs the first four, the same way CI does.
- `pre-commit run` runs the linting and formatting hooks (or `pre-commit run --all-files` to check everything).

If a check fails on your PR, click the "failed" icon (red cross) to see the build log and find out what needs fixing.

If the `pre-commit.ci` check fails, add a comment on your PR with the text `pre-commit.ci autofix`. This will tell the pre-commit bot to push a fix, and should work for common formatting issues.

markdownlint issues need to be fixed manually (the autofix bot can only handle formatting). The error output tells you the file, line number, and rule. Common issues and how to fix them:

| Error                            | What it means                                                         | How to fix                                                                                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **MD001** heading-increment      | A heading level was skipped (e.g., `##` followed by `####`)           | Use sequential heading levels                                                                                                                                                        |
| **MD025** single-h1              | More than one `#` top-level heading in a file                         | Use `##` or lower for subsequent headings (the page title in frontmatter counts as h1, so you don't need to write an h1 yourself)                                                    |
| **MD034** no-bare-urls           | A URL appears as plain text                                           | Make it a link (`[link text](https://...)`)                                                                                                                                          |
| **MD036** no-emphasis-as-heading | Bold or italic text on its own line looks like it should be a heading | If it should be a heading, use one (`##`, `###`, etc.). If it's informational (not a heading), use a label prefix so the bold text isn't the entire line: `**Date:** 24 April 2025`  |
| **MD040** fenced-code-language   | A fenced code block (` ``` `) has no language specified               | Add a language after the opening fence (e.g., ` ```python `, ` ```bash `, ` ```text `)                                                                                               |
| **MD045** no-alt-text            | An image is missing alt text                                          | Add a description: `![description of image](image.png)`. [Learn more about alt text](https://i0.wp.com/veroniiiica.com/wp-content/uploads/2018/01/capybara_alt_text.png?w=596&ssl=1) |
| **MD051** link-fragments         | A link points to a heading anchor that doesn't exist in the file      | Check the target heading's actual text and update the fragment                                                                                                                       |
| **MD059** link-image-style       | Link text is uninformative (e.g., "click here", "read more")          | Use descriptive link text that makes sense out of context. [Learn more about writing good link text](https://accessibility.huit.harvard.edu/technique-writing-link-text)             |

Full rule reference: <https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md>. Our configuration is in `.markdownlint-cli2.yaml`.

## Open your pull request

Understand every line you submit: you should be able to explain why each change is there, what it does, and what it could break, and answer review questions yourself. That includes code written with AI assistants or other tools. You're welcome to use them, but you're responsible for the result.

### Push your branch

Push your changes back to your fork on GitHub:

```bash
git push <your-username> bugfix-for-issue-1480
```

Go to GitHub. The new branch will show up with a green Pull Request button---click it.

### Write the description

- **Link the issue.** Use a closing keyword ("Fixes #123") only if the PR finishes everything the issue asks for. If it does only part, write "Part of #123" so merging doesn't close the issue. ([More on linking keywords](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).)
- **Say who runs into the problem** and what goes wrong for them today, in a sentence or two.
- **Say how you checked it:** the commands you ran and what they showed.
- **Point to the why.** If you did something non-obvious, say where the explanation lives ([Write down the why](#make-it-right-for-the-site-not-just-correct)).

### Review

Reviewers (the other developers and interested community members) will write inline and/or general comments on your PR to help you improve its implementation, documentation, and style. Every single contributor working on the project has their contributions reviewed, and we've come to see it as friendly conversation from which we all learn and the overall code quality benefits. Therefore, please don't let the review discourage you from contributing: its only aim is to improve the quality of project, not to criticize (we are, after all, very grateful for the time you're donating!).

To update your PR, make your changes on your local repository and commit. As soon as those changes are pushed up (to the same branch as before) the PR will update automatically.

If a PR still has the same problems after a round of requested changes, or doesn't meet this guide after being reminded of it previously, we'll close the PR and won't review further iterations. We have limited time to review contributions, and we need to reserve it for PRs that follow our guidelines.

## Keep your branch up to date

If GitHub indicates that the branch of your Pull Request can no longer
be merged automatically, merge the main branch into yours:

```bash
git fetch origin main
git merge origin/main
```

If any conflicts occur, they need to be fixed before continuing. See
which files are in conflict using:

```bash
git status
```

Which displays a message like:

```text
Unmerged paths:
  (use "git add <file>..." to mark resolution)

  both modified:   file_with_conflict.txt
```

Inside the conflicted file, you'll find sections like these:

```text
<<<<<<< HEAD
The way the text looks in your branch
=======
The way the text looks in the main branch
>>>>>>> main
```

Choose one version of the text that should be kept, and delete the rest:

```text
The way the text looks in your branch
```

Now, add the fixed file:

```bash
git add file_with_conflict.txt
```

Once you've fixed all merge conflicts, do:

```bash
git commit
```

> **_NOTE:_** Advanced Git users may want to rebase instead of merge, but we squash
> and merge PRs either way.
