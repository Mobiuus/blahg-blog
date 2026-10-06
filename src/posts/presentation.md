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
  /* Page plus large que la colonne 70ch du site */
  html:has(.presentation-container),
  body:has(.presentation-container) {
    max-width: 1100px;
    padding-bottom: 0;
  }
  /* Pied de page vide : masqué ici pour que tout tienne sans défilement */
  body:has(.presentation-container) footer {
    display: none;
  }

  /* Titre plus petit (sur une ligne), la date garde sa taille */
  .blog-article.presentation-page .article-title {
    font-size: 1.25em;
    line-height: 1.3;
    margin: 0 0 0.15em;
  }
  .blog-article.presentation-page hr {
    margin: 0.6rem 0;
  }

  /* L'embed occupe la place restante sous le titre : la page tient sur un écran.
     --above ≈ hauteur occupée au-dessus de l'embed (titre du site, menu, titre, date) */
  .presentation-container {
    --above: 355px;
    --ratio: 1.6872; /* 960 / 569 : format de l'embed Google Slides (slide + barre de contrôle) */
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: min(1100px, 100vw - 2.5rem, max(100dvh - var(--above), 300px) * var(--ratio));
    aspect-ratio: 960 / 569;
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
