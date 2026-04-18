---
title: "TRACE: Open Provenance Infrastructure for AI-Assisted Research"
---

## Abstract

AI tools are now active collaborators in the scientific workflow. They participate in writing code, analyzing data, and making methodological suggestions and decisions. But existing infrastructure records none of this. Further, there are no standards for what auditing decision provenance in AI-assisted workflows even looks like. Git tracks who committed code, not who had the idea. Lab notebooks capture human reasoning, not the AI-generated alternatives that were accepted or rejected. The result is a growing, measurable gap between actual AI use and what gets documented in the scientific process.

Our literature review of 547 environmental science papers using LLMs (2024–2026) quantifies this gap. Papers routinely name which model they used, but almost never record the methodological decisions the AI influenced, including which analytical approaches it suggested, which the researcher accepted, which were rejected, and which were revised and iterated. Decision provenance is systematically absent from the scientific process and its respective literature. Meanwhile, broader evidence suggests actual AI use in research runs 3–10x higher than formal disclosure rates.

[TRACE](https://github.com/Thru-Echoes/TRACE) (Transparent Recording of AI-assisted Collaboration Experiments) is an open-source protocol that addresses this infrastructure gap and is adoptable and extensible, rather than being a monolithic platform. Built on the Model Context Protocol (MCP) standard, TRACE runs as a lightweight sidecar alongside any AI tool, recording structured provenance for methodological decisions, contributions, and corrections in a research session. Its core data structure is the decision chain: who proposed an approach (human or AI), whether it was proactive or requested, and how it was resolved (accepted, revised, or rejected). This forms an auditable graph of research choices.

TRACE has been deployed across five active research projects at UC Berkeley spanning environmental policy, computational linguistics, corporate sustainability, and Natural Language Processing (NLP). The provenance record reveals patterns invisible to traditional version control. 74% of contributions are human-directed but AI-executed, humans and AI propose decisions at roughly equal rates, and there is over a 12% intervention rate (i.e. where humans correct or override AI work). Together, this provides a concrete, per-project measure of AI reliability. These patterns vary meaningfully across projects and disciplines which is precisely the kind of signal that reproducible and collaborative research needs to surface.

---

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/oliver-muellerklein.jpeg
:alt: Oliver Muellerklein
:class: speaker-bio-img
```

### Oliver Muellerklein | ESPM, UC Berkeley

Oliver Muellerklein is a PhD candidate at UC Berkeley in the Environmental Science, Policy, and Management (ESPM) department, where he researches the intersection of Transformers, LLMs, and other AI systems with environmental and climate language. His current work includes developing novel computational methods for cross-domain semantic analysis and topic modeling, applied across projects ranging from semantic compression in the public AI-art debate (in peer review), political language changes around climate change, and language alignment metrics. Motivated by the challenge of documenting AI's role in his own research, he developed TRACE (Transparent Recording of AI-assisted Collaboration Experiments), an open-source MCP-based protocol for creating audit trails of AI-assisted research workflows. Oliver has been a supporter of open-source and open science for over a decade.

:::
