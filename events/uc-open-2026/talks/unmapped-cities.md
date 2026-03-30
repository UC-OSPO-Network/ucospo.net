---
title: "Unmapped Cities: Scaling Pedestrian Infrastructure Mapping with Tile2Net"
---

## Abstract

Cities still lack consistent, citywide pedestrian infrastructure data, which limits basic analyses in accessibility, safety, and exposure. This talk introduces Tile2Net, an open-source, end-to-end tool that maps pedestrian infrastructure directly from orthorectified aerial imagery. I will walk through Tile2Net pipeline, from our custom trained semantic segmentation model to converting raster level predictions into georeferenced GIS layers and an initial network representation, so the audience understands both the mechanics and the assumptions behind the outputs.

Beyond the pipeline, the talk highlights what Tile2Net brings to practice: a reusable and inspectable workflow for producing pedestrian layers in places where they are missing or fragmented, and a common computational substrate for comparing infrastructure across cities. I will also be candid about open challenges and current work, especially in network topology: reliably extracting centerlines from elongated, irregular sidewalk polygons, preventing spurious breaks/merges, and improving connectivity around intersections and occlusions. I'll close with concrete directions for contributors and adopters, where improvements are most needed, and what "good use" looks like for planning and research.

---

:::{div}
:class: speaker-bio

```{image} ./speaker-headshots/maryam-hosseini.jpg
:alt: Maryam Hosseini
:class: speaker-bio-img
```

### Maryam Hosseini | University of California Berkeley

Maryam Hosseini is an Assistant Professor in City & Regional Planning at UC Berkeley, working at the intersection of computer vision, geospatial data systems, and urban planning. She developed Tile2Net, an open-source end-to-end system that converts orthorectified aerial imagery into pedestrian infrastructure layers and network representations, and CitySurfaces, a complementary framework for surface-aware urban mapping and analysis. She is an active contributor to open geospatial tooling communities, including UrbanTK and GeoJupyter, where she focuses on building reusable pipelines, evaluation practices, and documentation that make advanced geospatial methods transparent and reproducible.

:::
