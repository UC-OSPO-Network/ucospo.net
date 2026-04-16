---
title: "Using Continuous Integration to Ensure Accessible Experiences"
---

## Abstract

Meeting web accessibility (WCAG 2.1 +) requirements are a critical need for virtually all web projects, including those built by developers unfamiliar with the details. All UC Campuses now must comply with stronger Title II mandates from the DOJ. This presentation will show how we can leverage industry-standard practices like continuous integration (via GitHub Actions) to ensure software projects meet web accessibility standards. These CI workflows also have the added benefit of acting as traditional integration tests for software.

We've deployed Deque Labs' open source axe software across dozens of websites within CDSS and EECS at UC Berkeley. We've successfully used this workflow for public course websites (including syllabi, homework assignments, etc), research projects and custom web applications. Whenever a change is made to one of these projects, GitHub Actions will show users detailed feedback about how to resolve any accessibility issues. We've also augmented the axe output with simple scripts to help users identify which pages need the most attention.

These automated tests work by simulating a user in a headless Chrome browser instance. Client-side JavaScript then audits the HTML for WCAG compliance. Automated audits are particularly useful for ensuring proper color contrast, uses of text labels (such as alt text and ARIA) and correct HTML structure. In total there are more than 100 checks for each page tested.

While automated accessibility tests cannot cover all aspects of the WCAG requirements, we've used this process to train dozens of teaching assistants, and hundreds of students (through related coursework in software engineering courses) on these requirements. By raising issues 'just in time', this approach allows content authors the opportunity to address issues before updates are published, but without feeling like they need to memorize many smaller requirements.

Finally, we've used this approach to remediate and improve websites that are audited and monitored in SiteImprove. SiteImprove provides useful dashboards and guidance, but it is yet another login for many users for whom accessibility is not their primary responsibility, and requires waiting for a new crawl before you see new results. CI provides feedback usually within a minute of a push to GitHub, and can even be run locally for immediate results.

---

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/michael-ball.jpg
:alt: Michael Ball
:class: speaker-bio-img
```

### Michael Ball

Michael Ball is a Lecturer in the Electrical Engineering and Computer Sciences department at UC Berkeley, where he teaches CS 169 (Software Engineering) and Data C88C. His work bridges open source software development and CS education, with a focus on building scalable course infrastructure and educational tooling.
He is a core contributor to [Snap!](https://snap.berkeley.edu), a visual programming environment built on open web standards that introduces thousands of students worldwide to computer science. Snap! is the foundation of The Beauty and Joy of Computing, an AP CS Principles curriculum taught at hundreds of high schools and universities.
In CS 169, Michael teaches students to build and deploy Ruby on Rails applications with an emphasis on test-driven development, continuous integration, and web accessibility. His courses treat accessibility as a first-class engineering concern, with students writing automated accessibility tests alongside traditional feature specs.
Michael was previously an early engineer at Gradescope, a startup founded by UC Berkeley TAs and grad students. Michael returned to teaching after Gradescope was successfully acquired by Turnitin.

:::

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/silas-santini.jpg
:alt: Silas Santini
:class: speaker-bio-img
```

### Silas Santini

Silas Santini is a Course Software and Infrastructure Engineer at UC Berkeley's College of Computing, Data Science, and Society. A twice graduate of UC Berkeley (B.A. '22, M.S. '24) UC Berkeley CDSS, she studied data science and now supports approximately a dozen courses serving thousands of student enrollments and hundreds of teaching assistants and faculty members.
In her current role, Santini manages critical educational infrastructure that enables large-scale data science instruction. Her work combines software engineering expertise with a deep understanding of educational technology needs.
As a former student instructor, Santini has also advocated for hands-on, project-based learning and early technical exposure in data science education UC Berkeley CDSS. She brings both technical depth and a commitment to making computing education accessible to diverse student populations across UC Berkeley's expanding data science curriculum.

:::
