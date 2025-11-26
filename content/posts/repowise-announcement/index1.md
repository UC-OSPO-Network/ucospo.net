---
title: "Introducing RepoWise: A Conversational Framework for Mining and Reasoning About Open Source Repositories"
date: 2025-11-25T10:00:00-07:00
draft: false
summary: "RepoWise transforms how developers, maintainers, and researchers interact with OSS repositories through natural-language dialogue—enabling evidence-grounded exploration of governance, contributions, and community health."
tags: ["sustainability", "conversational-ai", "LLM", "repository-mining", "RAG"]
authors: ["Sankalp Kashyap", "Arjun Ashok", "Nafiz Imtiaz Khan", "Vladimir Filkov"]
featuredImage: "https://raw.githubusercontent.com/RepoWise/RepoWise-website/main/static/images/repowise-landing.png"
---

## From Forecasting to Exploration: The Next Chapter in OSS Intelligence

Understanding an open source project shouldn't require navigating scattered documentation, querying multiple APIs, or interpreting abstract metrics. Yet for newcomers and maintainers alike, answering simple questions—*"How do I contribute?"*, *"What are the project's governance policies?"*, *"Who are the most active contributors?"*—often demands hours of manual exploration across README files, CONTRIBUTING guides, issue trackers, and commit histories.

On the heels of **[OSSPREY](https://oss-prey.github.io/OSSPREY-Website/)**—our AI-powered sustainability forecasting tool that predicts the future health of OSS projects—the [DECAL Lab](https://decallab.cs.ucdavis.edu/) at UC Davis is proud to introduce **RepoWise**: a conversational framework that transforms repository analysis from static inspection to dynamic, interactive exploration.

While OSSPREY tells you *where* a project is heading, **RepoWise helps you understand *why***—through natural-language dialogue that surfaces insights from both technical artifacts and social signals.

[**Screenshot Placement Note: Insert Figure 2(a) - RepoWise Landing Page here**]

## Meet RepoWise

**[RepoWise](https://repowise.netlify.app)** is a domain-specialized conversational AI framework that enables users to interact meaningfully with GitHub repositories using large language models (LLMs) and retrieval-augmented reasoning. Instead of manually searching through documentation or writing complex queries, you can simply ask questions in natural language and receive evidence-grounded answers with inline citations and provenance metadata.

The RepoWise paper has been submitted to the **[MSR 2025 Tool Demonstration Track](https://2025.msrconf.org/)** (International Conference on Mining Software Repositories).

> **"RepoWise redefines repository analysis as an interactive, evidence-driven process—bridging the gap between human inquiry and software artifacts."**

## Why RepoWise Matters: Beyond Traditional Analytics

Traditional OSS analytics tools—from CHAOSS GrimoireLab to GitHub Insights—provide valuable metrics like commit counts, contributor graphs, and issue trends. However, they share a critical limitation: **they lack interpretability and interactivity**. You get numbers, charts, and dashboards—but not *answers*.

Recent LLM-powered tools like GitHub Copilot Chat, Sourcegraph Cody, and others offer conversational interfaces, but they're largely **generic wrappers around commercial models** with minimal domain-specific optimization for OSS-specific analytical tasks like governance reasoning, contributor forensics, or sustainability assessment.

### RepoWise Changes This Through:

1. **Comprehensive Documentation Mining**: Unlike tools focused solely on governance, RepoWise indexes and reasons over **nine critical project document types**:
   - README.md
   - CONTRIBUTING.md
   - GOVERNANCE.md
   - CODE_OF_CONDUCT.md
   - SECURITY.md
   - LICENSE
   - MAINTAINERS.md
   - CODEOWNERS
   - OWNERS

2. **Intelligent Intent Classification**: A five-stage hierarchical pipeline that achieves high precision by detecting whether your question is about documentation, commits, issues, or falls outside the system's scope—routing it to the appropriate retrieval engine.

3. **Dual Retrieval Architecture**: Combines semantic search (RAG-based) for documentation with structured queries (CSV-based) for commit and issue metadata—ensuring you get both qualitative insights and quantitative evidence.

4. **Privacy-Preserving Local Inference**: Uses Mistral 7B via Ollama for on-premises LLM processing, ensuring your repository data never leaves your infrastructure.

5. **Evidence-Grounded Responses**: Every answer includes inline citations, confidence scores, and provenance metadata—no hallucinations, no speculation.

[**Screenshot Placement Note: Insert Figure 2(b) - Example Response with Citations here**]

## How RepoWise Works: A Modular Architecture

RepoWise employs a sophisticated seven-module architecture:

### 1. User Interface (React Frontend)
A lightweight, chat-style interface that communicates asynchronously with the backend via RESTful APIs. Responses are rendered in markdown with inline citations for transparency.

### 2. Intent Router (Five-Stage Classification Pipeline)
The cognitive core that determines how each query should be processed:

- **Stage 0 - Out-of-Scope Detection**: Filters greetings and irrelevant queries (confidence: 0.99)
- **Stage 1 - Procedural Detection**: Identifies "how do I," "who maintains," "where can I find" patterns → routes to documentation (confidence: 0.95)
- **Stage 2 - Statistical Detection**: Detects numerical queries like "top contributors" → routes to commit/issue data (confidence: 0.90)
- **Stage 3 - Keyword Scoring**: Weighs domain-specific terms (governance keywords ≥1.5 → documentation; issue keywords ≥1.5 → issue data)
- **Stage 4 - Heuristic Fallback**: Handles edge cases through syntactic patterns

[**Screenshot Placement Note: Insert Figure 3 - Intent Classification Pipeline here**]

### 3. RAG Pipeline (Document Retrieval)
Handles all PROJECT_DOC queries through:
- **all-MiniLM-L6-v2** embeddings (384-dimensional vector space)
- **ChromaDB** vector store for semantic search
- **Top-5 retrieval** with hybrid re-ranking (semantic similarity + keyword overlap + document recency)
- **~3000 character contexts** for grounded LLM generation

### 4. CSV Data Pipeline (Structured Metadata)
Processes COMMITS and ISSUES queries through:
- **GitHub REST API** integration
- **Local CSV caching** to avoid rate limits
- **500-1000 character summaries** of contributor activity and issue participation

### 5. Prompt Assembly Engine
Constructs LLM prompts with:
1. System role definition (analytical persona)
2. Task-specific reasoning instructions
3. Anti-hallucination rules (constraining factual boundaries)
4. Retrieved contextual evidence
5. Original user question

*All prompt templates are publicly accessible at: [https://repowise.github.io/RepoWise-website/#prompt-templates](https://repowise.github.io/RepoWise-website/#prompt-templates)*

### 6. LLM Generation Module
- **Mistral 7B** via Ollama (local inference server)
- **Temperature: 0** for deterministic, factual outputs
- **Token streaming** with post-processing for markdown formatting and citation insertion

### 7. Response Delivery & Storage Layers
- Manages markdown formatting, citation hyperlinking, and real-time streaming
- Maintains ChromaDB embeddings, CSV cache, and file cache for efficient retrieval

[**Screenshot Placement Note: Insert Figure 1 - System Architecture here**]

## Real-World Use Cases

### 1. Contributor Onboarding & Documentation Navigation
New contributors face steep learning curves when joining mature OSS projects. RepoWise acts as an **interactive onboarding guide** that answers procedural questions like:

- *"How do I open a pull request?"*
- *"Where are the contribution guidelines located?"*
- *"What coding standards should I follow?"*
- *"Who are the maintainers of this repository?"*

By transforming static documentation into dynamic conversation, RepoWise accelerates onboarding and **reduces dependency on community gatekeepers** for repetitive queries.

### 2. Governance & Community Health Analysis
Maintainers, foundation curators, and auditors can assess **transparency, engagement, and maintenance activity** through queries like:

- *"Does this project have a documented governance structure?"*
- *"What is the project's license?"*
- *"Who has contributed the most in the past six months?"*
- *"Are there any security policies documented?"*

These evidence-based analyses help **diagnose sustainability risks**, enhance transparency, and accelerate due diligence in contexts like digital infrastructure auditing and dependency risk assessment.

### 3. Repository Forensics & Software Supply Chain Security
Researchers and security analysts can investigate:

- Licensing consistency across project files
- Detection of outdated contribution guidelines
- Tracing the provenance and evolution of governance decisions
- Identifying inactive maintainers or contributor turnover patterns
- Understanding code ownership and review processes

By enabling **conversational forensics over both documentation and metadata**, RepoWise strengthens the resilience of open-source supply chains and communities.

## Who Should Use RepoWise?

- **New Contributors**: Get instant answers to onboarding questions without waiting for maintainer responses
- **Project Maintainers**: Audit community health, track contribution patterns, and improve governance practices
- **OSS Foundation Leads**: Evaluate governance maturity and transparency across portfolio projects
- **Security Researchers**: Investigate security policies, maintainer activity, and supply chain risks
- **Academic Researchers**: Study software ecosystems, community dynamics, and sustainability patterns

## Beyond Static Analytics: A Paradigm Shift

RepoWise represents a fundamental shift in open-source software analytics—one that moves from **quantitative monitoring to interactive, explainable inquiry**. By coupling conversational retrieval with localized LLM reasoning, the system transforms how developers, maintainers, and researchers interact with repositories, **fostering transparency and insight through dialogue rather than static visualization**.

This paradigm shift aligns with broader trends in AI-mediated collaboration, where natural language becomes the primary interface for institutional knowledge exploration.

## What's Next: Future Directions

While RepoWise is fully operational and ready for deployment, we're actively working on:

1. **Agentic Multi-Turn Reasoning**: Extending beyond single-turn interactions to support conversational memory and autonomous query refinement
2. **Code-Level Analysis**: Integrating code summarization and dependency forensics beyond documentation
3. **Automatic Sustainability Scoring**: Combining with OSSPREY's forecasting capabilities to provide both diagnostic insights and predictive trajectories
4. **Public Deployment**: Web-based service with user authentication and persistent repository contexts
5. **Community-Driven Evaluation**: Longitudinal user studies to assess real-world usability and adoption

> **Imagine asking:** *"What are the sustainability risks for this project?"* and receiving both a forecast trajectory from OSSPREY and actionable governance recommendations from RepoWise.

## Ready to Explore?

Stop digging through documentation. Start asking questions.

<div style="text-align: center; margin: 2rem 0;">
  <a href="https://repowise.netlify.app" target="_blank" style="font-size: 1.2em; font-weight: bold; color: #0066cc;">🚀 Try RepoWise Now</a>
</div>

## Resources

- **[RepoWise App](https://repowise.netlify.app)** - Live conversational interface
- **[GitHub Organization](https://github.com/RepoWise)** - Open source codebase
- **[Project Website](https://repowise.github.io/RepoWise-website/)** - Documentation and architecture details
- **[Prompt Templates](https://repowise.github.io/RepoWise-website/#prompt-templates)** - Inspect our OSS-specialized prompts
- **[MSR 2025 Paper](https://2025.msrconf.org/)** - Full technical details and evaluation

## Open Source & Contributions Welcome

RepoWise is fully open source. Whether you want to extend the intent classification pipeline, add support for new document types, integrate additional retrieval engines, or improve the LLM generation quality—we welcome contributions and feedback from the community.

## Acknowledgments

This research was supported by the **National Science Foundation** under Grant No. 2020751, as well as by the **Alfred P. Sloan Foundation** through the OSPO for UC initiative (Award No. 2024-22424).

---

**Built by the DECAL Lab at UC Davis** | Making open source intelligence conversational—one question at a time.

*From forecasting sustainability with OSSPREY to exploring repositories with RepoWise, we're committed to building tools that strengthen the resilience and transparency of open source ecosystems.*