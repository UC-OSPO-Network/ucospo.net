---
title: "Making Jupyter Notebooks Accessible"
---

## Abstract

Jupyter Notebooks are a critical part of the data science pedagogy at UC Berkeley (serving over 14,000 students per semester). Ensuring the notebook content accessibility (a11y) is important to supporting the university's diverse student body, including the students currently receiving disability accommodation. Driven by an increase in student accommodation requests and upcoming legal mandates, authors need robust open source tools to bridge the gap between authoring practices and accessibility standards
This presentation introduces the JupyterLab-a11y-checker, an open-source engine developed by a UC Berkeley student team that is in the pilot stage. It functions as both a standalone CLI tool auditing Jupyter Notebook for common accessibility issues using GitHub Actions-based workflows and a real-time JupyterLab extension for interactive fixing of those issues. We will demonstrate how the tool's "fix interface" allows authors to resolve common accessibility issues, such as missing alt-text, improper heading structures, and poor color contrast ratio, in minimal clicks and the use of vision and language models to automate the generation of alt-text and table captions.

---

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/balaji-alwar.png
:alt: Balaji Alwar
:class: speaker-bio-img
```

### Balaji Alwar

Balaji Alwar is part of Research, Teaching, and Learning (RTL) and is a Service Lead for UC Berkeley's JupyterHub - DataHub. DataHub provides interactive computing environments to educators and students across campus, including Jupyter Notebooks. He has been working with a student team over multiple semesters to develop open-source tools that support authors in improving the accessibility of Jupyter Notebooks. He is passionate about utilizing technology to create digital public goods in education.

:::

### Chanbin Park

Chanbin Park is an undergraduate Computer Science student at UC Berkeley and a core developer of jupyter-a11y-checker. He is interested in the intersection of AI systems and human workflows, building tools that enable software and AI to more effectively support human work
