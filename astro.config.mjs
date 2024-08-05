import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: "https://valentin.vc",
  base: "/",
  integrations: [sitemap(), react({ ssr: true,include:['**/react/*'] }), tailwind(), mdx()],
  markdown: {
    shikiConfig: {
      theme: "material-theme-darker",
      langs: [],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/style/global.css"; @import "src/style/font.css";`
        }
      }
    }
  }
});