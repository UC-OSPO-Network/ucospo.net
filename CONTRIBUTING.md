# Contributor Guide

Thank you for investing your time in contributing to our project!

## Table of contents

- [Quickstart for experienced contributors](#quickstart-for-experienced-contributors)
- [What we expect in a pull request](#what-we-expect-in-a-pull-request)
- [New contributor guide](#new-contributor-guide)
  - [Development workflow](#development-workflow)
  - [Divergence from main](#divergence-from-origin-main)

## Quickstart for experienced contributors

- You can preview your changes to the site either:
  - Locally, as follows:
    - Install Node.js and run `npm install` (use the version in [`.nvmrc`](.nvmrc); run `nvm use`)
    - Run `make serve` (or `npx myst start`)
  - Via deploy preview (branch PRs only—not available for fork PRs):
    - Open a PR from a branch in this repo
    - After CI finishes, a comment will appear with a link to a preview of your changes
- To check accessibility: run `npm run build` then `npm run check-a11y`. This uses [pa11y-ci](https://github.com/pa11y/pa11y-ci) to test every page against WCAG 2.1 AA.
- To make sure your code passes linting and formatting checks, you can either:
  - Run `pre-commit run` before committing (or `pre-commit run --all-files` to check everything). This runs Prettier (formatting), markdownlint (structure and accessibility), Black (Python), and codespell (typos).
  - Wait until you've pushed your code and if the `pre-commit.ci` test fails, add a comment on your PR with the text `pre-commit.ci autofix`
    - This will tell the pre-commit bot to push a fix, and should work for common formatting issues
    - Note: markdownlint issues need to be fixed manually (the autofix bot can only handle formatting). The error output tells you the file, line number, and rule. Common issues and how to fix them:

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

- Please [use keywords to link relevant issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) in your PR's description or commit message
- We squash and merge PRs, so merging vs rebasing is up to you!

## What we expect in a pull request

These apply to everyone, maintainers included, whatever tools you use to write your code.

- **Keep the PR to one purpose:** every change in the diff should be needed to resolve the linked issue. Leave out unrelated fixes, reformatting of lines you didn't otherwise change, and drive-by edits; open a separate issue or PR for those.
- **Understand every line you submit:** you should be able to explain why each change is there and what it does. That includes code written with AI assistants or other tools. You're welcome to use them, but you're responsible for the result.
- **Don't weaken a check to make it pass:** it's very unlikely a "solution" will involve removing a linter or accessibility ignore, a test, or a timeout. In the very rare that such a removal is justified, explain why in the PR description, and make sure the underlying problem is fixed rather than hidden.
- **Write down the why:** if you do something non-obvious (a workaround, the least-bad option, something a future contributor might "fix" back), explain it in a code comment next to it, or in the README if contributors need to know it. PR descriptions and review comments are hard to find later.
- **Use MyST first:** if [MyST](https://mystmd.org/guide) markup can do it, use that instead of raw HTML or custom CSS.
- **Write alt text that says what the image conveys:** the linter only checks that alt text exists, not that it's useful. Describe what the image means in context, include any text that appears in it, and use empty alt text (`alt=""`) for purely decorative images.

Note: if a PR still has the same problems after a round of requested changes, or doesn't meet the above requirements after being reminded of them previously, we'll close the PR and won't review further iterations. We have limited time to review contributions, and we need to reserve it for PRs that follow our guidelines.

## New contributor guide

Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

### Development Workflow

1.  If you are a first-time contributor:
    - Go to <https://github.com/UC-OSPO-Network/ucospo.net/> and click the
      "fork" button to create your own copy of the project.

    - Clone the project to your local computer:

          git clone git@github.com:UC-OSPO-Network/ucospo.net.git

    - Navigate to your `ucospo.net` and add your personal GitHub repository:

          git remote add <your-username> git@github.com:<your-username>/ucospo.net.git

    - Now, you have remote repositories named:
      - `origin`, which refers to the `UC-OSPO-Network/ucospo.net` repository
      - `<your-username>`, which refers to your personal fork of `UC-OSPO-Network/ucospo.net`

2.  Develop your contribution:
    - Pull the latest changes from upstream:

          git switch main
          git pull origin main

    - Create a branch for the feature you want to work on. Since the branch name will appear in the merge message, use a sensible
      name such as `bugfix-for-issue-1480`:

          git switch -c bugfix-for-issue-1480

    - Commit locally as you progress (`git add` and `git commit`)
    - To preview your changes:
      - Install Node.js and run `npm install` (use the version in [`.nvmrc`](.nvmrc); run `nvm use`)
      - Run `make serve` (or `npx myst start`)
    - To check accessibility: run `npm run build` then `npm run check-a11y`
    - To make sure your code passes linting and formatting checks, you can:
      - Run `pre-commit run` before committing (see the [Quickstart](#quickstart-for-experienced-contributors) for details)
      - Wait until you've pushed your code and if the `pre-commit.ci` test fails, you can usually have the pre-commit bot push a fix to your branch by adding a comment on your PR with the text `pre-commit.ci autofix` (note: markdownlint issues need to be fixed manually—see the [Quickstart](#quickstart-for-experienced-contributors) for common issues and fixes)

3.  Submit your contribution:
    - Push your changes back to your fork on GitHub:

          git push <your-username> bugfix-for-issue-1480

    - Go to GitHub. The new branch will show up with a green Pull Request button---click it.

4.  Review process:
    - Every Pull Request (PR) update triggers a set of [continuous
      integration](https://en.wikipedia.org/wiki/Continuous_integration)
      checks that must pass before your PR can be merged:
      - **Build** — confirms the site builds successfully with MyST
      - **Link check** — [linkinator](https://github.com/JustinBeckwith/linkinator) verifies all internal and external links
      - **Accessibility** — [pa11y-ci](https://github.com/pa11y/pa11y-ci) tests every page against WCAG 2.1 AA
      - **Linting/formatting** — pre-commit.ci checks Prettier, markdownlint, Black, and codespell

      If a check fails, click the "failed" icon (red cross) to see the
      build log and find out what needs fixing.

    - If the `pre-commit.ci` test fails, you can usually have the
      pre-commit bot push a fix to your branch by adding a comment on your
      PR with the text `pre-commit.ci autofix`.
    - Reviewers (the other developers and interested community
      members) will write inline and/or general comments on your PR to
      help you improve its implementation, documentation, and style.
      Every single contributor working on the project has their contributions
      reviewed, and we've come to see it as friendly conversation
      from which we all learn and the overall code quality benefits.
      Therefore, please don't let the review discourage you from
      contributing: its only aim is to improve the quality of project,
      not to criticize (we are, after all, very grateful for the time
      you're donating!).
    - To update your PR, make your changes on your local repository
      and commit. As soon as those changes are pushed up (to the same
      branch as before) the PR will update automatically.

      > **_NOTE:_** If the PR closes an issue, make sure that GitHub knows to
      > automatically close the issue when the PR is merged. For example, if
      > the PR closes issue number 1480, you could use the phrase "Fixes
      > #1480" in the PR description or commit message.

### Divergence from `origin main`

If GitHub indicates that the branch of your Pull Request can no longer
be merged automatically, merge the main branch into yours:

    git fetch origin main
    git merge origin/main

If any conflicts occur, they need to be fixed before continuing. See
which files are in conflict using:

    git status

Which displays a message like:

    Unmerged paths:
      (use "git add <file>..." to mark resolution)

      both modified:   file_with_conflict.txt

Inside the conflicted file, you'll find sections like these:

    <<<<<<< HEAD
    The way the text looks in your branch
    =======
    The way the text looks in the main branch
    >>>>>>> main

Choose one version of the text that should be kept, and delete the rest:

    The way the text looks in your branch

Now, add the fixed file:

    git add file_with_conflict.txt

Once you've fixed all merge conflicts, do:

    git commit

> **_NOTE:_** Advanced Git users may want to rebase instead of merge, but we squash
> and merge PRs either way.
