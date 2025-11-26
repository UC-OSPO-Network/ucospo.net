---
title: "Introducing RepoWise: A Conversational AI Tool for Mining and Reasoning About OSS Repositories"
date: 2025-11-25T10:00:00-07:00
draft: false
summary: "RepoWise enables natural-language dialogue with Open-Source Software repositories, transforming how developers, maintainers, and researchers explore governance, contributions, and community health."
tags: ["sustainability", "conversational-ai", "LLM", "repository-mining", "RAG"]
authors: ["Sankalp Kashyap", "Arjun Ashok", "Nafiz Imtiaz Khan", "Vladimir Filkov"]
featuredImage: "https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-answer.png"
---

Understanding an open source project shouldn't require navigating scattered documentation, querying multiple APIs, or interpreting abstract metrics. Yet for newcomers and maintainers alike, answering simple questions—*"How do I start contributing?"*, *"Who are the most active contributors?"*, *"How do I report a bug?"*—often demands hours of manual exploration across README files, CONTRIBUTING guides, issue trackers, and commit histories.

On the heels of **[OSSPREY](https://oss-prey.github.io/OSSPREY-Website/)**—our AI-powered sustainability forecasting tool—the [Davis Excellent/Eclectic/Extreme Computational Analytics Lab (DECAL Lab)](https://decallab.cs.ucdavis.edu/) at UC Davis introduces **RepoWise**, extending our mission to make open source more accessible, transparent, and sustainable.

## Meet RepoWise

**[RepoWise](https://repowise.netlify.app)** is a  domain-specialized conversational AI framework that transforms how you interact with GitHub repositories. Instead of manually searching through documentation or writing complex queries, you can simply ask questions in natural language and receive evidence-grounded answers with inline citations and provenance metadata.

<p align="center">
  <img src="https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-icon.png" alt="RepoWise Icon" width="150"/>
</p>

The RepoWise paper has been submitted to the **[MSR 2026 Tool Demonstration Track](https://2026.msrconf.org/)**.

> "RepoWise redefines repository analysis as an interactive, evidence-driven process—bridging the gap between human inquiry and software artifacts."

## Why RepoWise Matters:

Traditional Open-Source Software (OSS) analytics tools show you metrics—stars, forks, commit counts—but they lack **interpretability** and **interactivity**. You get numbers, charts, dashboards but not answers. RepoWise changes this by offering:

- **Natural language queries** over repository documentation and metadata.
- **Dual retrieval architecture** combines semantic search (RAG-based) for documentation with structured queries (CSV-based) for commit and issue metadata to ensure you get both qualitative insights and quantitative evidence.
- **Evidence-grounded responses** with inline citations and confidence scores.
- **Privacy-preserving inference** using local LLMs (Mistral 7B via Ollama) for on-premises LLM processing, ensuring your repository data never leaves your infrastructure.

## How It Works

RepoWise employs a modular [architecture](https://repowise.github.io/RepoWise-website/#architecture) with intelligent query routing:

- **Intent Router:** A five-stage classification pipeline determines whether your question is about documentation, commits, issues, or something else—routing it to the appropriate retrieval engine.

- **RAG Pipeline:** For governance and documentation queries, semantic search over ChromaDB retrieves relevant passages from README, CONTRIBUTING, GOVERNANCE, and other project files using hybrid re-ranking.

- **CSV Data Pipeline:** For contributor and activity questions, structured queries fetch commit and issue metadata from the GitHub API with local caching to avoid rate limits.

- **Prompt Assembly:** Retrieved context is combined with task-specific reasoning instructions and anti-hallucination rules to construct grounded prompts. All [prompt templates](https://repowise.github.io/RepoWise-website/#prompt-templates) are publicly accessible.

- **LLM Generation:** Prompts are passed to a locally-hosted Mistral 7B model (temperature: 0) for deterministic, factual response generation with markdown formatting and inline citations.

![RepoWise in action: evidence-grounded answers with inline citations and source provenance](https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-answer1.png)

## Use Cases

### Contributor Onboarding
New contributors can ask *"How do I submit a pull request?"* or *"What coding standards should I follow?"* and receive step-by-step guidance extracted directly from project documentation—no more hunting through markdown files.

### Governance & Community Health
Maintainers and auditors can query *"Who are the most active contributors?"*, *"Who are the project maintainers?"*, or *"Does this project have a documented governance structure?"* to quickly assess transparency and contributor engagement.

### Repository Forensics
Researchers can investigate licensing consistency, detect outdated contribution guidelines, trace decision-making evolution, and identify sustainability risks—all through conversational queries that surface evidence from multiple sources.

## Who Should Use RepoWise?

Whether you're a **contributor** trying to onboard quickly, a **maintainer** auditing community health, an **OSS foundation lead** evaluating governance practices, or a **researcher** studying software ecosystems—RepoWise gives you interpretable, evidence-backed insights through simple conversation.

## Ready to Explore?

Stop digging through documentation. Start asking questions.

<a href="https://repowise.netlify.app" target="_blank"><strong>Try RepoWise Now</strong></a>

## Future Directions

We're working on extending RepoWise with agentic multi-turn reasoning, code-level analysis, dependency forensics, and automatic sustainability scoring. Integration with OSSPREY's forecasting capabilities is also on our roadmap—imagine asking *"What are the sustainability risks for this project?"* and receiving both a forecast trajectory and actionable recommendations.

RepoWise is open source and actively maintained. Contributions and feedback are welcome!

## Resources

- <a href="https://repowise.netlify.app" target="_blank">RepoWise App</a>
- <a href="https://github.com/RepoWise" target="_blank">GitHub Organization</a>
- <a href="https://repowise.github.io/RepoWise-website/" target="_blank">Project Website</a>
- <a href="https://repowise.github.io/RepoWise-website/#prompt-templates" target="_blank">Prompt Templates</a>

## Acknowledgments

This research was supported by the National Science Foundation under Grant No. 2020751, as well as by the Alfred P. Sloan Foundation through the OSPO for UC initiative (Award No. 2024-22424).

---

Built by the DECAL Lab at UC Davis, RepoWise is making open source intelligence conversational—one question at a time.
