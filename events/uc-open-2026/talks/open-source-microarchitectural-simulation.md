---
title: "Reflections on Building a High-Performance Open Source Microarchitectural Simulation Framework"
---

## Abstract

Microarchitectural simulation lies at the heart of computer-architecture research: it enables hypothesis validation, design-space exploration, and performance projection of next-generation processors. Credible simulation studies demand faithful models of modern out-of-order CPUs, representative workloads executed at scale, and productive workflows that combine high simulation speed with robust automation and analysis.

Developing such a framework is a daunting challenge, as modern CPUs are among the most intricate engineering systems ever created. In this talk, I will share insights from leading the development of Scarab, a high-performance microarchitectural simulator that combines detailed modeling accuracy, fast simulation throughput, and an industry-grade infrastructure. I will discuss lessons learned in (1) designing accurate and realistic models, (2) performing rigorous calibration and validation, (3) applying strong software-engineering practices, and (4) building scalable and maintainable simulation infrastructure. Together, these principles have made Scarab one of the most capable and extensible open-source CPU simulators available today.

---

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/heiner-litz.jpeg
:alt: Heiner Litz
:class: speaker-bio-img
```

### Heiner Litz | UCSC

Heiner Litz is an Associate Professor of Computer Science and Engineering at the University of California, Santa Cruz, where he holds the Kumar Malavalli Endowed Chair and directs the Center for Research in Storage Systems (CRSS). His research spans computer architecture, datacenter systems, storage, and scalable AI infrastructure. His contributions have been recognized with an NSF CAREER Award, the Intel Outstanding Researcher Award, multiple Best Paper Awards, and Google and Meta Faculty Awards. Litz received his Ph.D. in Computer Engineering from Mannheim University and previously held research appointments at the University of Heidelberg, Stanford, Google, and MIT.

:::
