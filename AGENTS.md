# Instructions for AI coding agents

This file is for AI agents helping someone contribute to ucospo.net. The rules that apply to every contributor live in the human guides, and you're expected to follow them: [README.md](README.md) says what the site is and how it's deployed, and [CONTRIBUTING.md](CONTRIBUTING.md) covers everything about working on it: choosing what to work on, setup, making and checking a change, and opening a PR. It's also what we review against. If this file and those guides ever disagree, the guides win.

This file adds only what's specific to agents, and points you to the part of CONTRIBUTING.md that matters at each step.

## Before you start

- Read README.md and CONTRIBUTING.md in full before changing anything. It follows a contribution from start to finish, and it's what we review against.
- Check the task against [Choose what to work on](CONTRIBUTING.md#choose-what-to-work-on). If it fails any of those questions, tell the human deploying you before you write any code.

## If you're asked to find things to fix

We generally close issues and PRs that come from scanning the codebase without an issue a maintainer has agreed to. If scanning is your task:

- Report what you find to the human deploying you as findings, not as issues or PRs.
- For each finding, go through [Choose what to work on](CONTRIBUTING.md#choose-what-to-work-on) and say which questions it passes and which it fails. Leave out findings that fail.
- Never choose new content (a new page or post) as something to do. Create it only when the human deploying you asks for it.

## While you edit

- Before changing code, scripts, config, or tests, re-read [Make it right for the site, not just correct](CONTRIBUTING.md#make-it-right-for-the-site-not-just-correct).
- Before editing Markdown, re-read [Follow the content conventions](CONTRIBUTING.md#follow-the-content-conventions). MyST comes before raw HTML.
- Keep each MyST directive option (lines like `:class: btn-center-wrapper`) on its own line directly under the directive's opening line. Agents tend to join them onto one line, which breaks the directive.
- Don't run a formatter over whole files. Change only the lines the task needs.

## Before you finish

- Re-read CONTRIBUTING.md's [Make your change](CONTRIBUTING.md#make-your-change) and [Check your change](CONTRIBUTING.md#check-your-change) now, at the end, and check your diff against every item in them. Tell the human deploying you about any item it doesn't meet.
- Run the checks in [Check your change](CONTRIBUTING.md#check-your-change), and fix any markdownlint issues by hand.

## GitHub, commits, and credit

- Don't open issues or PRs, or post comments on GitHub, yourself. Draft them for the human deploying you, who reads, edits, and submits them. Follow [Write the description](CONTRIBUTING.md#write-the-description).
- Don't invent anything: issue or PR numbers, file paths, functions, commands, or results. If you didn't check it, leave it out or say it's unchecked.
- Credit yourself in each commit you helped write with a `Co-authored-by:` trailer naming the tool, for example `Co-authored-by: Claude <noreply@anthropic.com>`. Use the trailer your tool provides if it has one.
- The human deploying you is responsible for the PR, not you and not the reviewer. They should understand every line well enough to explain why it's needed and what it could break, and to answer review questions without asking you. If they can't yet, help them get there before they open it.
