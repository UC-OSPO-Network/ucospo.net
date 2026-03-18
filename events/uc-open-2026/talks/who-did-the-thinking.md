---
title: "Who Did the Thinking? Documenting AI's Role in University Research"
---

## Oliver Muellerklein | ESPM, UC Berkeley

### Abstract

One instinct for documenting AI-assisted research is to count. How many lines of code did the AI write? But this misses what matters. Consider a familiar parallel: a PI tells an RA what analysis to run. The RA writes the code. But who came up with the intellectual direction (ideas, methodology, judgement)? Knowing who typed tells you almost nothing about who did the thinking. The same is true when the “RA” is an AI.

        Current infrastructure has no way to capture this distinction. Git tracks who committed code, not who had the idea. Lab notebooks capture human reasoning but not AI-generated alternatives that were accepted or rejected. This gap creates real problems for reproducibility, credit attribution, and compliance. The Colorado AI Act takes effect in 2026. The FDA's new guidance on AI in drug development mandates traceability and audit trails. The EU AI Act adds international obligations. The question is no longer whether to document AI's role, but how.

This directed discussion introduces and uses TRACE (Transparent Recording of AI-assisted Collaboration Experiments) as a launching point. TRACE is an open-source audit protocol build on the Model Context Protocol (MCP) standard that captures what traditional metrics miss, including structured decision provenance. The protocol captures who proposed each decision (human or AI), whether it was proactive or requested, and how it was resolved (accepted, revised, or rejected). Deployed across five UC Berkeley research projects spanning climate science, environmental humanities, and computational social science, TRACE has logged 100 events across 33 sessions. Early cross-project findings include contribution tracking exposing attribution patterns invisible to version control, e.g. distinguishing human-directed / AI-executed work from fully AI-initiated contributions.

The session opens with a brief walkthrough of real TRACE data, then transitions to facilitated discussion around three questions for the UC open-source community: (1) What should transparent AI attribution look like in practice for UC research? (2) How do we balance documentation rigor with workflow friction? (3) What role should campus OSPOs play in standardizing AI provenance infrastructure? Participants will leave with an adoptable open-source tool and a shared framework for AI transparency in open scholarship.

---

Oliver Muellerklein is a PhD candidate at UC Berkeley in the Environmental Science, Policy, and Management (ESPM) department, where he researches the intersection of Transformers, LLMs, and other AI systems with environmental and climate language. His current work includes developing novel computational methods for cross-domain semantic analysis and topic modeling, applied across projects ranging from semantic compression in the public AI-art debate (in peer review), political language changes around climate change, and language alignment metrics. Motivated by the challenge of documenting AI's role in his own research, he developed TRACE (Transparent Recording of AI-assisted Collaboration Experiments), an open-source MCP-based protocol for creating audit trails of AI-assisted research workflows. Oliver has been a supporter of open-source and open science for over a decade.
