---
title: "Introducing RepoWise: A Conversational AI Tool for OSS Repositories"
date: 2025-11-25T10:00:00-07:00
draft: false
summary: "RepoWise enables natural-language dialogue with Open-Source Software repositories, transforming how developers, maintainers, and researchers explore governance, contributions, and community health."
tags: ["sustainability", "conversational-ai", "LLM", "repository-mining", "RAG"]
authors: ["Sankalp Kashyap", "Arjun Ashok", "Nafiz Imtiaz Khan", "Vladimir Filkov"]
featuredImage: "https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-answer.png"
---

Understanding an open source project shouldn't require navigating scattered documentation, querying multiple APIs, or deciphering abstract metrics. Yet for newcomers and maintainers alike, answering simple questions like *"How do I start contributing?"*, *"Who are the most active contributors?"*, or *"How do I report a bug?"* often demands hours of manual exploration across README files, CONTRIBUTING guides, issue trackers, and commit histories.

We are happy to present **[RepoWise](https://repowise.netlify.app)** with a mission to make interacting with open source repositories more human, transparent, and sustainable.

## Meet RepoWise

**[RepoWise](https://repowise.netlify.app)** is a purpose-built conversational AI framework that transforms how you interact with GitHub repositories. Instead of manually searching through documentation or crafting complex queries, you can simply ask questions in natural language and receive evidence-grounded answers with inline citations and provenance metadata.

<p align="center">
  <img src="https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-icon.png" alt="RepoWise Icon" width="150"/>
</p>

> "RepoWise redefines repository analysis as an interactive, evidence-driven process, bridging the gap between human inquiry and software artifacts."

## Why RepoWise Matters

Traditional Open-Source Software (OSS) analytics tools show you metrics (stars, forks, commit counts) but they lack **interpretability** and **interactivity**. You get numbers, charts, and dashboards - but not answers. RepoWise changes this by offering:

- **Natural language queries** over repository documentation and metadata.
- **Dual retrieval architecture** that pairs semantic search over documentation with structured queries for commit and issue data, giving you both qualitative insights and quantitative evidence.
- **Evidence-grounded responses** with inline citations and confidence scores.
- **Privacy-preserving inference** using local LLMs for on-premises LLM processing, ensuring your repository data never leaves your infrastructure.

## How It Works

RepoWise employs a modular [architecture](https://repowise.github.io/RepoWise-website/#architecture) with intelligent query routing:

![RepoWise Architecture](https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-architecture.png)

- **Intent Router:** A five-stage classification pipeline determines whether your question is about documentation, commits, issues, or something else, then routes it to the appropriate retrieval engine.

- **RAG Pipeline:** For queries about project governance, contribution guidelines, and community policies, semantic search over a vector database retrieves relevant passages from key repository documents (README, CONTRIBUTING, GOVERNANCE, CODE_OF_CONDUCT, etc.) using hybrid re-ranking.

- **CSV Data Pipeline:** For contributor and activity questions, structured queries fetch commit and issue metadata from the GitHub API, with local caching to avoid rate limits.

- **Prompt Assembly:** Retrieved context is combined with task-specific reasoning instructions and anti-hallucination rules to construct grounded prompts. All [prompt templates](https://repowise.github.io/RepoWise-website/#prompt-templates) are publicly accessible.

- **LLM Generation:** Prompts are passed to a locally-hosted Mistral 7B model via Ollama (temperature 0) for deterministic, factual response generation with markdown formatting and inline citations.

![RepoWise in action: evidence-grounded answers with inline citations and source provenance](https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-answer1.png)

## Use Cases

### Contributor Onboarding

New contributors can ask *"How do I submit a pull request?"* or *"What coding standards should I follow?"* and receive step-by-step guidance extracted directly from project documentation. No more hunting through Markdown files.

### Governance & Community Health

Maintainers and auditors can query *"Who are the most active contributors?"*, *"Who are the project maintainers?"*, or *"Does this project have a documented governance structure?"* to quickly assess transparency and contributor engagement.

### Repository Exploration

Researchers can query licensing information, review contribution guidelines, identify current maintainers, and explore how governance is documented across a project. All through conversational queries that surface evidence directly from project files.

## Who Should Use RepoWise?

Whether you're a **contributor** trying to onboard quickly, a **maintainer** auditing community health, an **OSS foundation lead** evaluating governance practices, or a **researcher** studying software ecosystems, RepoWise gives you interpretable, evidence-backed insights through simple conversation.

## Ready to Explore?

Stop digging through documentation. Start asking questions.

Getting started is easy: select a featured repository or add any GitHub URL, and start asking questions. Sign-up is available but not mandatory.

**[Try RepoWise Now](https://repowise.netlify.app)**

## Future Directions

We plan to extend RepoWise into a fully agentic framework with autonomous query refinement, where the system can proactively gather evidence across multiple sources to answer complex questions. Future iterations will also include code summarization, dependency analysis, and automatic sustainability scoring.

RepoWise is open source and actively maintained. Contributions and feedback are welcome!

## Resources

- [RepoWise App](https://repowise.netlify.app)
- [Project Website](https://repowise.github.io/RepoWise-website/)
- [RepoWise GitHub Organization](https://github.com/RepoWise)

## Acknowledgments

This research was supported by the National Science Foundation under Grant No. 2020751, as well as by the Alfred P. Sloan Foundation through the OSPO for UC initiative (Award No. 2024-22424).

---

Built by the DECAL Lab at UC Davis, RepoWise is making open-source intelligence conversational, one question at a time.
