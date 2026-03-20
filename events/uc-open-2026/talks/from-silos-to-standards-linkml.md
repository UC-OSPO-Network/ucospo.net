---
title: "From Silos to Standards: Open Data Modeling with LinkML"
---

## Abstract

Whether you are a data producer (e.g., a scientific researcher) or a data consumer (e.g., a student, administrator, scientific software developer, or data scientist), well-structured, standardized data is of critical importance. Meanwhile, most of the data that is generated and shared is still stored in formats such as free-text lab notebooks, non-standardized spreadsheets, or data repositories. This lack of structure challenges interoperability, making data integration, validation, and reuse difficult. AI can assist with many data organization tasks, but its effectiveness depends on being guided by explicit structure. Well-defined schemas allow AI systems to check their work, clarify both input and output expectations, coordinate automated data workflows, and provide contextual grounding for iterative refinement. This scaffolding ensures that the resulting data models will be reusable and interoperable.

[LinkML (Linked Data Modeling Framework](linkml.io) addresses this need. LinkML is an open Python framework for modeling, validating, and distributing interoperable data. Widely adopted in scientific data management projects, LinkML enables schema alignment by fostering shared understanding among collaborators and bridging technical architectures. It streamlines data workflows by providing validation, schema translation, and integration mechanisms that support data ingestion, normalization, annotation, and export across heterogeneous systems.

As an added bonus, LinkML enables AI to be leveraged for tasks that require structured data extraction without sacrificing schema consistency or interoperability. By setting clear expectations about the structure and content of generated outputs, LinkML schemas help to make AI-driven data generation more reliable and reproducible. We will present tips for using AI tools effectively to accelerate and support your data modeling and data analysis efforts. Moreover, LinkML-structured data is natively “AI-ready”--suitable for input into AI-based analyses.

In this talk, we will briefly outline best practices for data modeling; introduce LinkML as a modeling framework and tool suite; and describe how to use LinkML to develop a data model and validate it with test data. We will also show how LinkML can work hand-in-hand with AI.

## About the Speakers

### Sierra Moxon

[Sierra Moxon](https://github.com/sierra-moxon) is a research software engineer at the Lawrence Berkeley National Laboratory who focuses on sustainable open-source software development in multidisciplinary research environments. She is an expert in scientific data modeling, data harmonization, the creation and use of ontologies and knowledge graphs, and AI/ML approaches to accelerate data curation, modeling, and analysis. Sierra has led the development of LinkML and helped mature it from a prototype to a widely-used framework. She plays critical roles in several important NIH-funded projects, developing standards and processes that improve software quality, reusability, and sustainability. In addition to developing software, Sierra has led the development and use of AI-assisted tools and workflows, software testing and release processes, and data modeling strategies.
On the NCATS Biomedical Data Translator project, Ms. Moxon is the technical lead of the Standards Committee and co-leads the Data Ingestion and Coordination Working Group. She is also a data modeling lead in the new DOE-funded BRIDGE project, a collaboration involving multiple US National Laboratories that aims to build a connected data framework to enable biological insights and biomolecular design.

### Nomi L. Harris

Nomi Harris is the Program Manager for the Berkeley Bioinformatics Open-Source Projects group (BBOP) at LBNL. She works to coordinate a portfolio of large multi-institution bioinformatics-related projects and ensure smooth operation and clear communication between collaborators and with the public. Nomi has a M.S. in computer science from MIT and a long history in bioinformatics, starting as a software developer and transitioning into scientific project management and communication. For many years, Nomi has chaired the annual Bioinformatics Open Source Conference (BOSC). She is also a board member of the Open Bioinformatics Foundation, a non-profit group that promotes open-source software development and open science within the biological research community.
