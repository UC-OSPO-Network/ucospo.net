---
title: CONTRIBUTING Guide
date: 2025-09-08
draft: false
description: "How to Write a Great Contributing Guide"
displayInList: true
author: ["Laura Langdon <laura-langdon>"]
---

This guide accompanies our [CONTRIBUTING template](🚧). Please refer to these [instructions for using the template](🚧).

Search for the word `TODO` in the template for links that need to be customized. When you finish editing 🚧 the template, remove the `TODO` bits.

## Welcome!

Your contributing guide is the first place that new contributors will look to understand if your project welcomes contributions and what to expect. So start off strong and make it clear that the project encourages people to contribute. Customize the introductory text in the template to fit your project culture.

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Come to Community Calls](#come-to-community-calls)
- [Finding an Issue](#finding-an-issue)
- [Setting Up a Dev Environment](#setting-up-a-dev-environment)
- [Running Tests](#running-tests)
- [Asking for Help](#asking-for-help)
- [Norms for Commits](#norms-for-commits)
- [Pull Request Lifecycle](#pull-request-lifecycle)
- [Code of Conduct](#code-of-conduct)

## Ways to Contribute

Brainstorm ways that contributors can help the project beyond the obvious code contributions. Maintainers often serve multiple functions and roles on a project, not just technical decision making (which is harder to delegate) but also marketing, content creation, technical writing, project management, community management, and more! If you would accept help with any of these tasks, call that out to attract a more diverse set of contributors with complementary skillets to your existing contributors.

Don’t forget to assess maintainer availability and be realistic about which type of contributions you are willing to shepherd through your processes to ensure contributors are successful. Large vendor-backed projects are more likely to have time to mentor and assist people new to open source or programming. We encourage you to start with a limited list of paths to contributing, and expand them over time as your project grows.

Think about your project’s contribution ladder, and if it makes sense, encourage people to review pull requests as a way to contribute as well.

Often security-related contributions, such as reporting security issues, are handled by a specific security process. Include a link to your security reporting process so that people can find and follow it.

## Come to Community Calls

If your project has open [community calls](https://opensource.com/open-organization/16/1/community-calls-will-increase-participation-your-open-organization), encourage contributors to attend and customize the template with your meeting information. The more contributors interact with your project, the more likely they are to find meaningful ways to contribute and stick around.

## Finding an Issue

Often contributors want to help out but don’t know where to start. If you have an issue labeling strategy, explain it here. For example, “good first issue” or “help wanted” for new contributors.

If you copied our template repo, your repo came with a few issue templates to help new contributors know what information you need in an issue, and you can find them in the `.github/ISSUE_TEMPLATE` directory at the project root. Check out GitHub's [instructions for creating/editing/removing issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates).

Let contributors know how they should indicate that they want to work on an issue, such as commenting with “I would like to work on this”.

If your project doesn’t always have issues labeled and ready to find, and you are willing to help find suitable issues, let new contributors know how to ask for something to work on.

## Setting up a Dev Environment

Provide enough information so that someone can find your project on the weekend and get set up, build the code, test it, and submit a pull request successfully without having to ask any questions. If there is a one-off tool they need to install, common error people run into, or useful script they should run, document that here.

Document any necessary tools, such as linters, or recommended IDE extensions. You don’t have to document the beginner’s guide to these tools, but how they are used within the scope of your project. This is a great place to include links to new user documentation videos and examples to get people started and understanding how to use the project

You should explain how to do at least these basic tasks:

- Get the source code
- Retrieve any dependencies
- Build the source code
- Run the project locally
- Test the source code, unit and “integration” or “end-to-end”
- Generate and preview the documentation locally

## Running Tests

Document the process you use to test code in your project:

1. Step one
2. Step two

## Asking for Help

Expect that all contributors will get stuck sometimes and figure out how they should ask for help. This is a great time to not only direct them to the proper communication channel but also provide links to relevant documentation such as a contributing tutorial, troubleshooting guides, etc.

If yours is a project that regularly gets contributors who are also new to git or the programming language, considering linking to where they can get help for non-project related questions, such as [Learn Git Branching](https://learngitbranching.js.org/?locale=en_US).

## Norms for Commits

Let contributors know if your project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

If your projects expects contributors to sign their commits, provide instructions for they should do that. You might refer to [GitHub's commit signing instructions](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits), and refine your instructions as new contributors ask questions about the process.

## Pull Request Lifecycle

We encourage you to think about your pull request process and set expectations for both contributors and reviewers. We've included an extensive section in our template, but you don't need to adopt every aspect! Pick and choose what makes sense for *your* project.

If you copied our template repo, your repo came with a PR template and you can find it in the `.github` directory at the project root. Check out GitHub's [instructions for creating/editing/removing issue templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates).

Use the questions below as an exercise to uncover the unwritten rules and norms your project has for both reviewers and contributors. Use your answers to create your template:

- When should contributors start to submit a PR—when it’s ready for review or as a work-in-progress? Should they use draft PRs to indicate that a PR isn't yet ready for review?
- How do contributors signal that a PR is ready for review or that it’s not complete and still a work-in-progress?
- When should the contributor should expect initial review? The follow-up reviews?
- When and how should the author ping/bump when the pull request is ready for further review or appears stalled?
- How to handle stuck pull requests that you can’t seem to get reviewed?
- How to handle follow-up issues and pull requests?
- What kind of pull requests do you prefer: small scope, incremental value or feature complete?
- Do you use feature branches?
- What should contributors do if they no longer want to follow-through with the PR? Do maintainers sometimes commit to the PR directly to help get it merged? Or do maintainers close a PR if the contributor hasn’t responded in a specific time frame?
- Give contributors an idea of how their pull request is evaluated and how to run checks locally before submitting the pull request. Include both the automated and any manual checks performed by reviewers.
- Once a PR is merged, what is the process for it getting into the next release?
- When does a merged pull request end up in a release?

## Code of Conduct

All OSS projects need a Code of Conduct (COC) to establish expectations of behavior for all members of the community, and here you can either link to the template (after you've edited to match your project!) or create a new one ([check out our Code of Conduct Guide](code-of-conduct-guide.md))

## Attribution

We're grateful to the team at CNCF for creating an [excellent guide](https://contribute.cncf.io/maintainers/templates/contributing/) we've referred to *extensively* in writing this one!
