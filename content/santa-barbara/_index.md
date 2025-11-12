---
title: UC Santa Barbara Open Source Program
---

<!-- Using HTML since Hugo {{figure}} shortcode wasn't working for me -->
<div style="float:center">
  <img src="/images/ucsb/library2_1600.jpg"
       srcset="/images/ucsb/library2_640.jpg 640w,
               /images/ucsb/library2_1280.jpg 1280w,
               /images/ucsb/library2_1600.jpg 1600w"
       sizes="(max-width: 800px) 640px,
              (max-width: 1440px) 1280px,
              1600px"
       alt="UCSB library exterior"
       style="width:100%; height:auto;" />
  <figcaption style="font-size: 0.5rem; margin-top: 0rem;">
  <em>Image courtesy of UCSB</em>
  </figcaption>
</div>

### About us

UC Santa Barbara has a strong history of leadership and innovation in open
source software development and open science. However, expertise and resources
have traditionally been distributed across various parts of the campus. The Open
Source Programs Team at UCSB serves as a central hub, bringing together open
source activities, expertise, and community connections.

UC Santa Barbara is a proud partner in the UC OSPO Network, collaborating
alongside five other UC campuses. Our support for both the UCSB community and
the broader network includes:

- Identifying and cataloging open source projects developed at UC campuses
- Creating educational materials, curricula, and best practice guidelines
- Offering services and resources aimed at ensuring the sustainability of open
  source projects

If you'd like to keep up with our activities, please consider joining our
mailing list, which includes a monthly newsletter and occasional announcements.
You can unsubscribe at any time.

<!-- Button to join our mailing list -->
<div style="
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
">
  <a href="https://lp.constantcontactpages.com/sl/hlmtgmY/ucsbospo" style="
    display: inline-block;
    padding: 1rem 2rem;
    background-color: #003660;
    color: white;
    text-align: center;
    text-decoration: none;
    font-size: 1.25rem;
    border-radius: 8px;
    font-family: sans-serif;
  "
    target = "_blank"
    onmouseover="this.style.backgroundColor='#005799'"
    onmouseout="this.style.backgroundColor='#003660'"
  >
    Join our mailing list
  </a>
</div>

<!-- Colored box for current projects -->
<div style="
  clear: both;  /* clear floats */
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
  <img src="/images/ucsb/ucsb_meetup.png"
       loading="lazy"
       alt="UCSB students working on laptops in a group setting"
       style="width:100%; height:auto;" />
  <figcaption style="font-size: 0.5rem; margin-top: 0rem;">
  </figcaption>
</div>

Once a month, the UCSB Open Source Programs Team hosts a casual, in-person, open
source meetup. The meetup is open to UCSB students, faculty, and staff of all
backgrounds and experience levels. The format rotates between attendee-led
discussions and the "Open Source Lounge", a coworking group where we tackle our
individual open source goals. This is a great opportunity to meet others
interested in open source, share tips and experiences, and be a part of a larger
open source community at UCSB.

<!-- Text color is ignored due to !important override above, due to mobile template issues -->
<div style="
  height: 20vh;
  display: flex;
  justify-content: left;
  align-items: center;
">
<!-- Container for link/button allows for outer padding -->
  <div style="padding-left: 10vw;">
  <a href="/santa-barbara/ucsb-projects/meetup/" style="
    display: inline-block;
    padding: 1rem 2rem;
    background-color: #f4f3f1;
    color: hotpink;
    text-align: center;
    text-decoration: none;
    font-size: 1.25rem;
    border-radius: 8px;
    border: 2px solid #003660;
    font-family: sans-serif;
  "
    onmouseover="this.style.backgroundColor='#ffffff'"
    onmouseout="this.style.backgroundColor='#f4f3f1'"
  >
    Visit the meetup webpage
  </a>
  </div>
</div>

### UC Open Source Survey

<div style="float:left; width:360px; margin:1em 1em 1em 0;">
  <img src="/images/ucsb/hands.jpg"
       loading="lazy"
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

## What's the status of the UCSB OSPO?

At present, UCSB does not have a dedicated Open Source Programs Office. Rather,
we have a cross-functional team of UCSB staff with knowledge and expertise in
open source who are developing the strategies, know-how, and connections needed
to create an OSPO.

We envision that the UCSB OSPO will:

- Help students, faculty, and staff to exchange knowledge and build connections,
- Promote open source awareness on campus,
- Advise on open source licenses,
- Help our campus to leverage the full potential of open source,
- And more!

Building on the work of the Open Source Programs Team, the OSPO will draw on
resources developed by the UC OSPO Network, and its priorities will be shaped by
both UC leadership and the UCSB open source community.

The current UCSB open source programs team includes staff members at the UCSB
Library, and we expect that the Library will continue to be the center of
gravity for this work for the foreseeable future.

## Get connected

<div class="ospo-img" style="float:right; width:180px; margin:0 0 1em 1em;">
  <img src="/images/ucsb/UCSB-ospo.png"
       alt="UCSB open source programs logo"
       style="width:100%; height:auto;" />
</div>

- To stay informed about our activities,
  [join our mailing list](https://lp.constantcontactpages.com/sl/hlmtgmY/ucsbospo).
- For inquiries, email us at ospo@library.ucsb.edu.
- We’re also on Slack! If you’d like an invitation, please email us.
- Our team:
  - Virginia Scarlett, Open Source Programs Specialist
  - Amber Budden, Associate University Librarian for Digital Strategies
  - Jonathan Balkind, Assistant Professor of Computer Science
  - Greg Janée, Director, Research Data Services, UCSB Library
