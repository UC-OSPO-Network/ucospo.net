---
title: "Open Science Assistant (OSA): An Easy-to-Onboard AI Chatbot for Open Source Research Projects"
---

## Abstract

Open source research tools are central to modern science, yet their communities often struggle with onboarding new users, answering recurring questions, and keeping documentation accessible. This talk introduces the Open Science Assistant (OSA), an extensible AI chatbot platform built with LangGraph/LangChain and FastAPI that makes it remarkably easy for any open source project to deploy a domain-specific assistant.

OSA is designed around a YAML-driven community registry: a project maintainer adds a single configuration file that declares their documentation sources, GitHub repositories, and system prompt, and OSA auto-generates API endpoints and an embeddable chat widget. There is no model training, no separate infrastructure to maintain, and no complex setup. Knowledge bases pull from multiple sources including GitHub issues and PRs, OpenALEX papers, Discourse forums, and mailing lists, so the assistant stays grounded in the project's own materials.

The platform already serves specialist assistants for HED (Hierarchical Event Descriptors), BIDS (Brain Imaging Data Structure), EEGLAB, and NEMAR. Each assistant provides accurate, citation-backed answers tailored to its domain. Communities can extend their assistant with custom tools, such as calling external validation APIs, and deploy the chat widget on their website with a few lines of HTML.

This presentation will demonstrate how OSA works, walk through the five-minute process of adding a new community assistant, and show the chat widget in action on real neuroscience project websites. Attendees will see firsthand how easy onboarding is and learn how to evaluate OSA for their own open source projects.

---

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/seyed-yahya-shirazi.png
:alt: Seyed Yahya Shirazi
:class: speaker-bio-img
```

### Seyed Yahya Shirazi | University of California San Diego

Seyed Yahya Shirazi, Ph.D., is an Assistant Project Scientist and Principal Investigator at the Swartz Center for Computational Neuroscience, Institute for Neural Computation, University of California San Diego. His research integrates computational neuroscience with human cognition and behavior, with a focus on biosignal analysis, neuroinformatics, and the neural control of movement.

Dr. Shirazi is an active contributor to major open source research projects including EEGLAB, BIDS (Brain Imaging Data Structure), and HED (Hierarchical Event Descriptors). He is the founder of the OpenScience Collective and the creator of the Open Science Assistant (OSA), an extensible AI chatbot platform that helps open source research communities provide domain-specific support to their users. His work on OSA grows directly from years of experience developing open source tools and seeing firsthand how difficult it is for small research teams to scale community support alongside software development.

:::
