# Contributor Guide

Thank you for investing your time in contributing to our project!

## Table of contents

- [Quickstart for experienced contributors](#quickstart-for-experienced-contributors)
- [New contributor guide](#new-contributor-guide)
  - [Development workflow](#development-workflow)
  - [Divergence from main](#divergence-from-origin-main)

## Quickstart for experienced contributors

- You can preview your changes to the site either:
  - Locally, as follows:
    - [Install Hugo](https://gohugo.io/installation/)
    - [Install Dart Sass](https://gohugo.io/functions/css/sass/#dart-sass)
    - Run `make serve`
  - Via Netlify's "deploy preview":
    - Create a draft PR
    - After Netlify finishes running its checks, click "Deploy Preview" in the comment created by the Netlify bot
- To make sure your code is formatted as the linter expects, please either:
  - [Run Prettier from your terminal](https://prettier.io/docs/install) or as an extension in your IDE, e.g. the [VS Code Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    - Make sure to read the docs for whichever option you choose to learn how to format on save or format manually!
  - Wait until you've pushed your code and if the `pre-commit.ci` test fails, add a comment on your PR with the text `pre-commit.ci autofix`
    - This will tell the pre-commit bot to push a fix, and should work for common formatting issues
- Please [use keywords to link relevant issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) in your PR's description or commit message
- We squash and merge PRs, so merging vs rebasing is up to you!

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
      - [Install Hugo](https://gohugo.io/installation/)
      - [Install Dart Sass](https://gohugo.io/functions/css/sass/#dart-sass)
      - Run `make serve`
    - To make sure your code is formatted as the linter expects, you can:
      - [Run Prettier from your terminal](https://prettier.io/docs/install) or as an extension in your IDE, e.g. the [VS Code Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
      - Wait until you've pushed your code and if the `pre-commit.ci` test fails, you can usually have the pre-commit bot push a fix to your branch by adding a comment on your PR with the text `pre-commit.ci autofix`

3.  Submit your contribution:

    - Push your changes back to your fork on GitHub:

          git push <your-username> bugfix-for-issue-1480

    - Go to GitHub. The new branch will show up with a green Pull Request button---click it.

4.  Review process:

    - Every Pull Request (PR) update triggers a set of [continuous
      integration](https://en.wikipedia.org/wiki/Continuous_integration)
      services that check that it is up to standards and passes
      all our tests. These checks must pass before your PR can be
      merged. If one of the checks fails, you can find out why by
      clicking on the "failed" icon (red cross) and inspecting the
      build and test log.
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
