---
title: Citation Guide
date: 2026-07-30
description: "How to Make Your Software Citable with CITATION.cff"
author: Laura Langdon
---

This guide accompanies our [CITATION.cff template](https://github.com/UC-OSPO-Network/templates/blob/main/CITATION-template.cff). Please refer to these [instructions for using the template](https://github.com/UC-OSPO-Network/templates#how-to-use-the-templates).

When people build on your software in their own research, you want them to be able to cite it easily, consistently, and in a way that credits everyone who contributed. A `CITATION.cff` file is the simplest way to make that happen. It's a small, human- and machine-readable file (written in [YAML](https://en.wikipedia.org/wiki/YAML)) that lives in the root of your repository and spells out exactly how you'd like your work cited. The format has a friendly canonical home at [citation-file-format.github.io](https://citation-file-format.github.io/), which is the best place to go for the full picture.

Using this file has a couple of benefits:

- GitHub reads it automatically: when a `CITATION.cff` is present, GitHub adds a "Cite this repository" button to your repo's sidebar that hands visitors a ready-made APA or BibTeX citation
- Reference managers understand it: tools like [`cffconvert`](https://github.com/citation-file-format/cffconvert)—one of [many tools built to work with `CITATION.cff` files](https://github.com/citation-file-format/citation-file-format#tools-to-work-with-citationcff-files-wrench)—turn your file into BibTeX, RIS, CodeMeta, and other formats, so a citation flows straight into someone's paper with no retyping (and no transcription errors 😉)

## Creating your file

The easiest way—and the one we recommend—is [**cffinit**](https://citation-file-format.github.io/cff-initializer-javascript/), the web form linked from the site above. It walks you through the fields, builds a valid `CITATION.cff` for you, and makes it really hard to end up with a broken file.

Would you rather write it by hand? Our [CITATION.cff template](https://github.com/UC-OSPO-Network/templates/blob/main/CITATION-template.cff) gives you a working starting point with `TODO` markers for the parts you fill in. Either way, the field reference below explains what everything means.

## The essentials

Four fields are required, and here's what each one is for:

- `cff-version`: which version of the Citation File Format you're using. Leave this as `1.2.0` unless you have a reason to change it.
- `message`: the note tools show alongside your citation, e.g. "If you use this software, please cite it using the metadata from this file."
- `title`: the name of your software.
- `authors`: everyone you'd like credited. Each author gets `given-names` and `family-names`; adding an [ORCID](https://orcid.org/) and `affiliation` is optional but strongly encouraged, because it disambiguates people with common names. For an organization rather than a person, use `name: "My Lab"` instead.

## Worth adding

These ones aren't required, but they make your citation far more useful:

- `version` and `date-released`: which version of your software this file refers to. Update these each time you cut a new release, so citations point at the right version.
- `repository-code` and `url`: where the code lives and, optionally, the project's homepage.
- `license`: your project's [SPDX license identifier](https://spdx.org/licenses/) (e.g. `BSD-3-Clause`). Make sure it matches your `LICENSE` file! (See our [License Guide](license-guide.md))
- `identifiers`: a **DOI** gives your software a permanent, citable identifier. The usual route is to [connect your GitHub repo to Zenodo](https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content), which mints a DOI automatically each time you make a release.
- `abstract` and `keywords`: a sentence of description and a few keywords help others find and understand your work.

## Citing a paper instead of the software

Sometimes there's a journal article you'd rather people cite than the software itself. The `preferred-citation` block lets you describe that paper, and citation-aware tools will point people to it while still recognizing the software. The template includes a `preferred-citation` example you can fill in or delete.

## Before you commit

If you built your file with **cffinit**, it's already valid. If you edited the template by hand, give it a quick check—`cffconvert --validate` validates from the command line if you're using `cffconvert`, or you can paste the file into **cffinit**. A `CITATION.cff` with a typo will silently break the tools that read it, so it's worth the 30 seconds to validate!

For the full specification and more advanced options (datasets, conference papers, multiple identifiers, and more), see the [Citation File Format documentation](https://citation-file-format.github.io/).
