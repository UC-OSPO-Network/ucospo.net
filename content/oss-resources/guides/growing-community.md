---
title: Growing a Community Around a Project
date: 2025-07-09
draft: false
description: "How to start a community around an open source project"
displayInList: true
author: ["Laura Langdon <laura-langdon>"]
---

If you maintain an open source project and want to attract contributors to it but don't know where to start, the OSPO network is here to help! This guide will walk you through setting up the essential documentation and infrastructure a contributor-friendly project needs.

Every OSS project seeking contributors needs to have the following files in the root directory of the project's repo:

## README

The first page a potential new user will see when investigating your project will be its `README.md` file, which is usually written in [Markdown](https://www.markdownguide.org/).

Your README should definitely contain:

- The name of your project
- An overview of the problem your project solves
- Instructions for how to set up and use the project
- Links to your project's:
  - [Contributing guidelines](#contributing-guidelines)
  - [Code of Conduct](#code-of-conduct)
  - [Open source license](#open-source-license)
  - Community discussion space, if you have one (like Discord, GitHub Discussions, or forum)
- Contact info: maybe a name and email address, or even just a brief note to communicate by opening an issue (whatever you prefer!)
- Citation info, if applicable
- Acknowledgements, if applicable

And if you have a bit more time, you could add:

- A brief discussion of your project's non-goals, which will:
  - Save you and your potential contributing users time by avoiding creating pull requests that won't be accepted
  - Help all potential users (contributing or not!) understand your project better!
- Screenshots or GIFs of your project
- Code examples

## Contributing guidelines

Users considering contributing to your project will look for its `CONTRIBUTING.md` file to find guidelines on:

- How to set up a development environment
- How to run tests
- Creating issues
- How to identify issues they might work on
- Communication
- Code and style conventions
- Commit conventions
- Creating pull requests

You might also like to set up templates for contributors to use when creating issues and pull requests:

- [GitHub issue/PR templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [GitLab issue/PR templates](https://gitlab.com/gitlab-org/gitlab/-/tree/master/.gitlab/issue_templates)

## Code of Conduct

All OSS projects need a Code of Conduct (COC) to establish expectations of behavior, and there's no shortage of templates to use for ideas. The [Contributor Covenant](https://www.contributor-covenant.org/) is a great place to start!

## Open source license

A project can't be open source without a license, and the Office of the President has created a [guide to choosing a license](https://security.ucop.edu/files/documents/resources/oss-chart-companion.pdf) that makes sense for your project and meets UC requirements.
