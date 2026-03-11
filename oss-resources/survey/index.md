---
title: 2025 UC Open Source Contributor Survey
---

<style>
.infographic-preview-container {
    display: flex;
    justify-content: start;
}
.summary-text {
    max-width: 70%;
    flex: 1 1 auto;
}
.infographic-spacer {
    width: 100px
}
.infographic-preview {
    padding-top: 10px;
    max-width: 100px;
    height: auto;
    flex: 0 0 auto;
}
.infographic-preview:hover {
    opacity: 0.7;
}
@media screen and (max-width: 650px) {
    .infographic-preview-container {
        flex-wrap: wrap;
    }
    .infographic-spacer {
        display: none;
    }
    .summary-text {
        max-width: 100%;
    }
}
.modal {
    display: none;
    justify-content: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.9);
}
.modal-content {
    position: relative;
    margin-top: 7vh;
    margin-bottom: 7vh;
    max-width: 600px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}
.infographic-preview-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: block;
    width: 100px;
}
.infographic-preview-btn:focus-visible {
    outline: 2px solid #003cb3;
    outline-offset: 2px;
}
.modal-close {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
}
.modal-close:hover,
.modal-close:focus {
    opacity: 0.7;
    outline: 2px solid white;
    outline-offset: 2px;
}
@media screen and (min-width: 611px) and (max-width: 713px) {
    .modal-content { max-width: 500px; }
}
@media screen and (min-width: 521px) and (max-width: 610px) {
    .modal-content { max-width: 400px; }
}
@media screen and (min-width: 441px) and (max-width: 520px) {
    .modal-content { max-width: 320px; }
}
@media screen and (max-width: 440px) {
    .modal-content { max-width: 250px; }
}
.screen-reader-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
    white-space: nowrap;
}
</style>

Welcome to the homepage for the 2025 UC Open Source Contributor Survey! Here
you'll find all the [artifacts associated with this study](#links-to-research-products), a summary of what it's all about, and updates on our
ongoing research.

## Summary and key findings

Open source is an approach to software development that allows others to reuse
the source code and build their own program from it. Many open source projects
also welcome community contributions to the codebase. Much if not most academic
software is open source, but universities have historically prioritized other
types of research products. As a result, university policies, services, and
impact metrics often overlook the needs and accomplishments of open source
developers.

In May 2025, the UC OSPO Network conducted a survey to shed light on open source
activity at the University of California and to identify opportunities for
increased support. We received 294 responses from experienced or aspiring open
source contributors across ten UC campuses, a group that included students,
faculty, and staff.

<div class="infographic-preview-container">
    <div class="summary-text">
    <p>We found that the vast majority of students and researchers consider open source
software to be important for their work. We also found that the majority of open
source contributors at UC are project maintainers, meaning they are the primary stewards of a project.
Despite the importance and prevalence of open source software, about one-third
of respondents reported that they have shared their code on custom websites,
indicating that a large body of academic software is not located in standard
repositories. Contributors face many challenges in terms of resources, computing
infrastructure, and institutional culture. At the same time, the abundance of
maintainers and the prevalence of time and funding-related challenges underscore a critical need for support for
maintenance costs and overall sustainability of open source software.
    </p>
    <p>Check out the study's key findings in our infographic! Click on the preview for
a closer look.
    </p>
    </div>
    <div class="infographic-spacer"></div>
    <div style="width: 100px">
        <button
            type="button"
            class="infographic-preview-btn"
            aria-haspopup="dialog"
            aria-label="View full infographic (opens dialog)"
        >
            <img
                src="infographic_small.png"
                alt=""
                class="infographic-preview"
                width="100"
            >
        </button>
    </div>
    <div style="width: 1rem"></div>
    <a style="padding-top: 10px; display: inline;" href="infographic.pdf"
        download="infographic.pdf">
        Download the infographic
    </a>
</div>

<div id="myModal" class="modal" role="dialog" aria-modal="true" aria-label="Survey infographic" aria-describedby="infographic-sr-content">
<div class="modal-content">
    <button type="button" class="modal-close" aria-label="Close infographic">×</button>
    <img src="infographic.png" alt="UC Open Source Contributor Survey 2025 infographic">
</div>
</div>

<span id="infographic-sr-content" class="screen-reader-only">
    <p>Here is the content of the infographic.</p>
    <p>The University of California Open Source Survey 2025. Brought to you by the UC OSPO Network.</p>
    <p>Key results. 92% of students and 93% of researchers report that open source is important for their work. 58% of UC open source contributors are project maintainers. Who contributes to large projects? 27% of academics and 43% of non-research staff occasionally or frequently contribute to large projects. The number one challenge, that is, the most frequent challenge for experienced contributors, was finding time for documentation.</p>
    <p>A diagram shows the top three solutions preferred by experienced contributors and aspiring contributors. The top three solutions preferred by experienced contributors were, in order: grants for open source sustainability, access to free, feature-rich computing environments, and a learning community. The top three solutions preferred by aspiring contributors were access to free, feature-rich computing environments, a learning community, and educational materials.</p>
    <p>Other forms of support proposed by survey participants include: Personnel: centralized maintenance help; Careers: education on open source careers; Guidelines: clear rules for UC employees; Code review: communities of practice.</p>
</span>

## Advice for Open Source Program Offices (OSPOs)

- The most common challenges that emerged from our study were **time and
  funding**. As such, OSPOs should consider either directly funding open source,
  or consider creative ways to "give back" time or money. Examples might include
  facilitating co-working groups, promoting AI tools for documentation, or
  providing support for external grant acquisition.

- We encountered high demand for affordable, accessible, feature-rich computing
  environments. This suggests an opportunity for academic OSPOs to help secure
  the **technical infrastructure** needed for open source development.

- Comments revealed three broad categories of concern: **Resources,
  Infrastructure, and Culture**. OSPOs should foster an **institutional
  culture** where open source activities are not merely monitored or regulated,
  but also supported, celebrated, and rewarded.

## Project status

We intend to continue deploying improved versions of this survey at UC again in
the future, perhaps every two years. If you deploy an open source survey at your
campus or in your academic community, we'd love to hear about it, whether or not
you used our survey instrument.

As part of the survey, we gave respondents the opportunity to share their GitHub
(GitLab, etc.) usernames with us. We plan to use these data to investigate
where, how, and how often UC contributors are contributing to small and large
open source repos. This may happen in the second half of 2026.

If you are interested in collaborating with us on this or on another research
effort, please reach out to us at ospo@library.ucsb.edu.

(links-to-research-products)=

## Links to research products

- **Preprint:** https://doi.org/10.31235/osf.io/p8bx6_v1
  - To find the preprint's supplementary materials, you have to go the 'Project'
    in OSF that has the same title as the preprint. Find it here:
    https://osf.io/m5ft6/overview
- The **data** will be here\*: https://doi.org/10.5061/dryad.2280gb662
- An archived snapshot of the **code** will be here\*:
  https://doi.org/10.5281/zenodo.17783102
  - \*These two DOIs will be functional after peer review. Please contact the
    authors if access is needed sooner.
- **Living code** repository:
  https://github.com/UC-OSPO-Network/ospo-survey-analysis
- **Survey instrument** is available as a PDF in the preprint's supplementary
  materials and in the GitHub repo. It will also available in .docx and .qsf
  formats in the Dryad dataset.
- **Lessons learned**, a retrospective on the survey instrument:
  https://github.com/UC-OSPO-Network/ospo-survey-analysis/blob/main/lessons_learned.md

<script>
const previewBtn = document.querySelector('.infographic-preview-btn');
const modal = document.getElementById('myModal');
const modalClose = document.querySelector('.modal-close');
const docBody = document.body;

function openModal() {
    modal.style.display = 'flex';
    docBody.style.overflow = 'hidden';
    modalClose.focus();
}

function closeModal() {
    modal.style.display = 'none';
    docBody.style.overflow = 'visible';
    previewBtn.focus();
}

previewBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
});
</script>
