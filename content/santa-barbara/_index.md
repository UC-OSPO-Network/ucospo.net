---
title: UC Santa Barbara Open Source Program
---

<!-- Using HTML since Hugo {{figure}} shortcode wasn't working for me -->
<div style="float:center">
  <img src="library_1280.jpg"
       srcset="library_320_crop.jpg 320w,
               library_640_crop.jpg 640w,
               library_1280_crop.jpg 1280w,
               library_1600_crop.jpg 1600w"
       sizes="(max-width: 480px) 320px,
              (max-width: 800px) 640px,
              (max-width: 1440px) 1280px,
              1600px"
       alt="UCSB library exterior"/>
  <figcaption style="font-size: 0.5rem; margin-top: 0rem;">
  <em>Image courtesy of UCSB</em>
  </figcaption>
</div>

UC Santa Barbara is one of the six campus partners in the UC Network of Open
Source Program Offices (OSPOs) focused on supporting developers and users of
Open Source through the discovery and indexing of UC developed Open Source;
development of educational materials, curricula and best practices guidelines;
and services and guides in support of Open Source sustainability.

## What’s the status of the UCSB OSPO?

At present, UCSB does not have a dedicated Open Source Programs Office. Rather,
we have a cross-functional team of UCSB staff with knowledge and expertise in
open source who are developing the strategies, know-how, and connections needed
to create an OSPO. Through the collaborative
[Alfred P. Sloan Foundation grant](https://news.ucsc.edu/2024/04/uc-ospo-network/),
our team is conducting a landscape analysis on the state of open source at UCSB
to better inform and advocate for future services.

## What would an OSPO at UCSB look like?

We envision that the UCSB OSPO will:

- help students, faculty, and staff to exchange knowledge and build connections,
- promote open source awareness on campus, and
- help our campus to leverage the full potential of open source.

We also foresee the OSPO advising on open source licenses, promoting best
practices for creating and utilizing sustainable open source technology, and
fostering increased community engagement. Building on the work of the Open
Source Programs Team, the OSPO will draw on resources developed by the UC OSPO
Network, and its priorities will be shaped by both UC leadership and the UCSB
open source community.

The current UCSB open source programs team includes staff members at the UCSB
Library, and we expect that the Library will continue to be the center of
gravity for this work for the foreseeable future.

<!-- Colored box for current projects -->
<div style="
  --panel-bg: #D7D2CB;
  background-color: var(--panel-bg);
  padding: 0 1rem;     /* 0rem top/bottom, 1rem left/right */
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  overflow: auto;
">

<h2 style="margin-top: 1rem; margin-bottom: 1rem; text-align: center;">
Current projects
</h2>

### UCSB Open Source Meetup

<div style="float:right; width:360px; margin:0 0 1em 1em;">
  <img src="lunch.png"
       alt="Stylized picture of lunch foods"
       style="width:100%; height:auto;" />
  <figcaption style="font-size: 0.5rem; margin-top: 0rem;">
  <em>Image courtesy of LumenSt for Getty Images</em>
  </figcaption>
</div>

We are thrilled to be launching the UCSB Open Source Meetup! This group is open
to UCSB students, faculty, and staff who are interested in open source, and is
designed to help members build skills and connections. We will meet in-person
once a month, except a few months a year, in which **we will join other OSPO
Network campuses in a combined virtual meeting**. We will rotate between casual
discussions and talks from guest speakers (both UCSB and industry). If there is
demand, we may also do code reviews or mini-projects! Here are some of the
topics we’re thinking of discussing:

- CI/CD, unit tests
- Contributing guidelines and code style guides
- Getting started contributing
- Forking and branching
- Licensing
- Open source security, bug horror stories, bug awards?
- Building community
- Funding open source
- The history of open source
- Companies that have switched from open to closed licenses
- Open source AI

The in-person meetings will be on the first Wednesday of the month at noon in
room 1411 in the UCSB Library (inside the Sara Miller McCune Arts Library).
**Bring your lunch!**

- Join the
  [mailing list](https://lp.constantcontactpages.com/sl/hlmtgmY/ucsbospo)
- [Add it to your calendar](https://ucospo.net/events/) so you know which
  meetings are in-person and which are virtual.

<h3 id="survey-header" style="
  margin-top: 2em;
  margin-left: calc(360px + 1em);  /* image width + its right margin */
  text-align: left;
">
UC Open Source Survey
</h3>

<!-- If you change the width of this image, change the header alignment above, too -->
<div style="float:left; width:360px; margin:0 1em 1em 0;">
  <img src="hands.jpg"
       alt="Close-up of a pair of hands using a phone beside a computer"
       style="width:100%; height:auto;" />
  <figcaption style="font-size: 0.5rem; margin-top: 0rem;">
  <em>Image courtesy of firmbee on Unsplash</em>
  </figcaption>
</div>

Our team recently spearheaded a survey of more than 200 open source contributors
as part of the UC OSPO Network’s discovery activities. You can read more about
the [structure of the survey here](https://ucospo.net/survey-launch/). We are
currently analyzing the data, and will circulate the results once published.
Until then, the survey instrument is available upon request, and we are happy to
answer questions.

</div>

<style>
  /* 1) For this colored box, override the theme's CSS for mobile, which uses white font */
  div[style*="--panel-bg"] * {
    color: black !important;
  }

    /* 2) Restyle images for mobile */
  @media (max-width: 600px) {
    /* Stop floats and make image containers full-width */
    div[style*="--panel-bg"] > div[style*="float:right"],
    div[style*="--panel-bg"] > div[style*="float:left"] {
      float: none !important;
      width: 100% !important;
      margin: 0 0 1em 0 !important;
    }

    /* Ensure images never exceed container width */
    div[style*="--panel-bg"] img {
      max-width: 100% !important;
      height: auto !important;
    }
  }

    /* 3) If screen is smaller than survey image, reset survey header to be left-aligned */
  @media (max-width: 360px) {
    #survey-header {
      margin-left: 0 !important;
      text-align: left !important;
    }
  }

  /* On mobile, center the OSPO logo */
  @media (max-width: 600px) {
    .ospo-img {  /* Give the ospo logo container its own class */
      float: none !important;
      display: block;           /* make it a block to honor auto margins */
      margin: 0 auto 1em auto;  /* top 0, sides auto, bottom 1em */
      width: 180px !important;  /* keep its intended width */
    }
  }
</style>

## Get connected

<div class="ospo-img" style="float:right; width:180px; margin:0 0 1em 1em;">
  <img src="UCSB-ospo.png"
       alt="UCSB open source programs logo"
       style="width:100%; height:auto;" />
</div>

- To stay informed about our activities,
  [join our mailing list](https://lp.constantcontactpages.com/sl/hlmtgmY/ucsbospo).
- For inquiries, email us at ospo@library.ucsb.edu.
- We’re also on Slack in the UC-Tech workspace, on the #open-source channel. If
  you’d like an invitation, please email us.
- Our team:
  - Virginia Scarlett, Open Source Programs Specialist
  - Amber Budden, Associate University Librarian for Digital Strategies
  - Jonathan Balkind, Assistant Professor of Computer Science
  - Greg Janée, Director, Research Data Services, UCSB Library
