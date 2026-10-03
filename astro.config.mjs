import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://khlee.2e16.me",
  integrations: [
    sitemap({
      filter: (page) => !page.startsWith("https://khlee.2e16.me/post/"),
    }),
    mdx(),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
