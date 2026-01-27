---
title: 2025 UC Open Source Contributor Survey
---

<style>
/* As usual, I am using html and css because I'm already familiar with them, and this is easier for me than learning Hugo syntax.*/
    .infographic-preview {
        max-width: 100px;
        height: auto;
        margin-left: 12vw;
        margin-right: auto;
    }
    .infographic-preview:hover {
        opacity: 0.7;
    }

    .modal {
    display: none; /* Hidden by default */
    justify-content: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto; /* Enable scroll if needed */
    -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
    }

    .modal-content {
    margin-top: 25vh;
    max-width: 600px;
    }


    @media screen and (min-width: 611px) and (max-width: 713px) {
    .modal-content {
        max-width: 500px;
    }
}
    @media screen and (min-width: 521px) and (max-width: 610px) {
        .modal-content {
            margin-top: 20vh;
            margin-bottom: 10vh;
            max-width: 400px;
        }
    }
    @media screen and (min-width: 441px) and (max-width: 520px) {
        .modal-content {
        margin-top: 20vh;
        margin-bottom: 10vh;
        max-width: 320px;
    }
}
    @media screen and (min-width: 368px) and (max-width: 440px) {
        .modal-content {
            margin-top: 10vh;
            margin-bottom: 5vh;
            max-width: 250px;
        }
    }
    @media screen and (max-width: 367px) {
        .modal-content {
            margin-top: 10vh;
            margin-bottom: 5vh;
            max-width: 200px;
        }
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
    white-space: nowrap; /* Ensures the text is not wrapped */
}
</style>

Welcome to the homepage for the 2025 UC Open Source Contributor Survey! Here
you'll find all the artifacts associated with this study, a summary of what it's
all about, and updates on our ongoing research.

## Key findings

Check out the study's key findings in our infographic! Click on the preview for
a closer look.

<!-- Preview/thumbnail image -->
<img src="infog_preview.png" alt="Infographic about the survey" class="infographic-preview">

<!-- Modal -->
<div id="myModal" class="modal">

<!-- Modal Image -->
<div class="modal-content">
    <img src="infographic.png">
</div>
</div>

<div style="
  display: flex;
  font-size: 1.5rem;
  margin-left: 6vw;
">
<!-- Download link -->
  <a href="infographic.png"
    download="survey_infographic.png">
    Download the infographic
  </a>
</div>

<span class="screen-reader-only">
    <p>Here is the content of the infographic.</p>
    <p>The University of California Open Source Survey 2025. Brought to you by the UC OSPO Network.</p>
    <p>In May 2025, the UC OSPO Network Surveyed 294 experienced or aspiring open source contributors. Respondents included students, faculty, and staff from ten UC Campuses. This study aims to characterize the challenges faced by UC's open source contributors and identify opportunities for increased support.</p>
    <p>Key results. 92% of students and 93% of researchers report that open source is important for their work. 58% of UC open source contributors are project maintainers. Who contributes to large projects? 27% of academics and 43% of non-research staff occasionally or frequently contribute to large projects. The number one challenge, that is, the most frequent challenge for experienced contributors, was finding time for documentation.</p>
    <p>A diagram shows the top three solutions preferred by experienced contributors and aspiring contributors. The order of the solutions is indicated by their position on a podium, in either first place, second place, or third place. The top three solutions preferred by experienced contributors were, in order: grants for open source sustainability, access to free, feature-rich computing environments, and a learning community. The top three solutions preferred by aspiring contributors were access to free, feature-rich computing environments, a learning community, and educational materials. Some text beside the first podium says that nearly one in three experienced contributors said that sustainability grants would be the most helpful solution the university could offer. Some text beside the second podium says that two out of three aspiring contributors said that accessible computing environments would help them get started contributing.</p>
    <p>Other forms of support proposed by survey participants include the following:
        <ul>
            <li>Personnel: centralized maintenance help</li>
            <li>Careers: education on open source careers</li>
            <li>Guidelines: clear rules for UC employees</li>
            <li>Code review: communities of practice</li>
        </ul>
    </p>
</span>

## Advice for OSPOs

- The most common challenges that emerged from our study were **time and
  funding**. As such, OSPOs should consider either directly funding open source
  development, or coming up with creative ways to “give back” time or money.
  Examples might include facilitating co-working groups, promoting AI tools for
  documentation, or providing support for external grant acquisition.

- We encountered high demand for affordable, accessible, feature-rich computing
  environments. This suggests an opportunity for academic OSPOs to help secure
  the **technical infrastructure** needed for open source development.

- Comments revealed three broad categories of concern: **Resources,
  Infrastructure, and Culture**. Areas of concern within culture included
  availability of clear policies and expectations regarding open source work,
  support for teaching open source, and recognition of the value of open source.
  OSPOs should foster an **institutional culture** where open source activities
  are not merely monitored or regulated, but also supported, celebrated, and
  rewarded.

## Project status

We intend to continue deploying improved versions of this survey at UC again in
the future, perhaps every two years. If you deploy an open source survey at your
campus or in your academic community, we’d love to hear about it, whether or not
you used our survey instrument.

As part of the survey, we gave respondents the opportunity to share their GitHub
(GitLab, etc.) usernames with us. We plan to use these data to investigate
where, how, and how often UC contributors are contributing to small and large
open source repos. This may happen in the second half of 2026.

If you are interested in collaborating with us on this or on another research
effort, please reach out to us at ospo@library.ucsb.edu.

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
const previewImg = document.querySelector('.infographic-preview');
previewImg.addEventListener('click', (e) => {
    // modal.style.display = "block";
    modal.style.display = "flex";

})

const modal = document.getElementById("myModal");

window.onclick = function(event) {
if (event.target == modal) {
modal.style.display = "none";
}
}
</script>
