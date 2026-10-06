---
layout: ../layouts/BlogPost.astro
title: "Climate Crossroads: Europe's automotive industry at the breaking point"
slug: presentation
description: "Climate Crossroads: Europe's automotive industry at the breaking point"
tags: []
added: 2025-03-07
---

<div class="presentation-container">
  <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRrcYu4Er60nPZDhNkbEws578arHDpwplCNc8rgVgkF-yiR8MEfqlDMc_N0il_vCnATGs8BriqsrLCK/embed?start=false&loop=false&delayms=10000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>


<style>
  /* sort de la colonne 70ch du body pour un embed plus large */
  .presentation-container {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: min(1100px, 100vw - 2.5rem);
    aspect-ratio: 960 / 569; /* format de l'embed Google Slides (slide + barre de contrôle) */
    overflow: hidden;
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
  
</style>

<script>
  // Check if this is the presentation page and add a class to body
  if (window.location.pathname.includes('/post/presentation')) {
    document.body.classList.add('presentation-page');
  }
</script>