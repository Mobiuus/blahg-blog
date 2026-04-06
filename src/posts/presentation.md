---
layout: ../layouts/BlogPost.astro
title: "Climate Crossroads: Europe's automotive industry at the breaking point"
slug: presentation
description: "Climate Crossroads: Europe's automotive industry at the breaking point"
tags: []
added: 2025-03-07
---

<div class="presentation-container">
  <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRrcYu4Er60nPZDhNkbEws578arHDpwplCNc8rgVgkF-yiR8MEfqlDMc_N0il_vCnATGs8BriqsrLCK/embed?start=false&loop=false&delayms=10000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>" frameborder="0" width="100%" height="600" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>


<style>
  .presentation-container {
    position: relative;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    overflow: hidden;
    width: 100%;
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
  
  @media (max-width: 480px) {
    :global(.blog-article.presentation-page) {
      padding: 0 1rem;
    }
  }
</style>

<script>
  // Check if this is the presentation page and add a class to body
  if (window.location.pathname.includes('/post/presentation')) {
    document.body.classList.add('presentation-page');
  }
</script>