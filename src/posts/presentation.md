---
layout: ../layouts/BlogPost.astro
title: "Master thesis"
slug: presentation
description: "European Automakers' Strategic Response to Chinese Competition"
tags: []
added: 2025-03-07
---

<div class="presentation-container">
  <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vT1ynv8hR_60ZdumkRZmr9V_LPMyDGPdyE45aOtt83CiRk54mFHCxaGaFnI5Vqbxehn2GSKnhf7lre3/embed?start=false&loop=false&delayms=10000" frameborder="0" width="100%" height="600" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

<style>
  .presentation-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    overflow: hidden;
    margin-left: -15%;
    width: 130%;
  }
  .presentation-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
  
  /* This ensures the wider container doesn't create horizontal scrolling on small screens */
  @media (max-width: 900px) {
    .presentation-container {
      margin-left: 0;
      width: 100%;
    }
  }
</style>