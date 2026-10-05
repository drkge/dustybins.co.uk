// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import { SITE_URL } from "./src/consts";

/**
 * Sitemap weight by path. Categories and products share the root, so anything
 * not listed here (every category and product) gets the default.
 * @type {[RegExp, number, string][]}
 */
const PRIORITIES = [
  [/^\/$/, 1.0, "weekly"],
  [/^\/all-products\/$/, 0.9, "weekly"],
  [/^\/contact\/$/, 0.5, "yearly"],
  [/^\/privacy\/$/, 0.2, "yearly"],
];

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: SITE_URL,
  trailingSlash: "always",
  build: { format: "directory" },
  // Category and product URLs match the old BigCommerce shop, so nothing needs
  // redirecting. Shop-only pages (/cart.php, /login.php) fall through to the 404.
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/search/"),
      serialize(item) {
        const { pathname } = new URL(item.url);
        const match = PRIORITIES.find(([pattern]) => pattern.test(pathname));
        item.priority = match ? match[1] : 0.7;
        item.changefreq = /** @type {any} */ (match ? match[2] : "monthly");
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    icon(),
  ],
  vite: {
    // Cast: Tailwind's plugin is typed against a newer Vite than Astro 5 bundles.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
