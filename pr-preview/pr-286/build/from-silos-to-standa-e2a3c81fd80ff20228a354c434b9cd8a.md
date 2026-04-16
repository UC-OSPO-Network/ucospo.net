---
title: "From Silos to Standards: Open Data Modeling with LinkML"
---

## Abstract

Whether you are a data producer (e.g., a scientific researcher) or a data consumer (e.g., a student, administrator, scientific software developer, or data scientist), well-structured, standardized data is of critical importance. Meanwhile, most of the data that is generated and shared is still stored in formats such as free-text lab notebooks, non-standardized spreadsheets, or data repositories. This lack of structure challenges interoperability, making data integration, validation, and reuse difficult. AI can assist with many data organization tasks, but its effectiveness depends on being guided by explicit structure. Well-defined schemas allow AI systems to check their work, clarify both input and output expectations, coordinate automated data workflows, and provide contextual grounding for iterative refinement. This scaffolding ensures that the resulting data models will be reusable and interoperable.

[LinkML (Linked Data Modeling Framework)](https://linkml.io) addresses this need. LinkML is an open Python framework for modeling, validating, and distributing interoperable data. Widely adopted in scientific data management projects, LinkML enables schema alignment by fostering shared understanding among collaborators and bridging technical architectures. It streamlines data workflows by providing validation, schema translation, and integration mechanisms that support data ingestion, normalization, annotation, and export across heterogeneous systems.

As an added bonus, LinkML enables AI to be leveraged for tasks that require structured data extraction without sacrificing schema consistency or interoperability. By setting clear expectations about the structure and content of generated outputs, LinkML schemas help to make AI-driven data generation more reliable and reproducible. We will present tips for using AI tools effectively to accelerate and support your data modeling and data analysis efforts. Moreover, LinkML-structured data is natively "AI-ready"--suitable for input into AI-based analyses.

In this talk, we will briefly outline best practices for data modeling; introduce LinkML as a modeling framework and tool suite; and describe how to use LinkML to develop a data model and validate it with test data. We will also show how LinkML can work hand-in-hand with AI.

---

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/nomi-harris.jpeg
:alt: Nomi Harris
:class: speaker-bio-img
```

### Nomi Harris | Lawrence Berkeley National Laboratory

Nomi Harris is the Program Manager for the [Berkeley Bioinformatics Open-Source Projects group](https://berkeleybop.org/people/nomi-harris/) at the Lawrence Berkeley National Laboratory, led by Chris Mungall. In this role, she coordinates an extensive portfolio of large multi-institution open-source projects. Nomi was one of the co-founders of the annual Bioinformatics Open Source Conference (BOSC), now in its 27th year; she has been chairing BOSC since 2011. She is also the Vice President of the Open Bioinformatics Foundation, which promotes open-source software development and open science within the biological research community. Nomi has a M.S. in computer science from MIT and a long history in bioinformatics, starting as a software developer and transitioning into scientific project management and communication. In her spare time, she fosters kittens (141 so far--yes, of course she has a spreadsheet).

:::
