# Dusty Bins

Website for [Dusty Bins](https://dustybins.co.uk) — recycling bins, litter bins and steel and plastic wheelie bins,
from Coatbridge.

A static [Astro](https://astro.build) site styled with Tailwind CSS 4, deployed to GitHub Pages. It replaces the old
BigCommerce shop with a catalogue: there are no prices, basket or checkout. Every product has an **Enquire** button
that opens an email with the product already filled in. On product pages, the customer can pick colours, lids and
extras first, and their choices and quantity go into the email too.

## Commands

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Local dev server at `http://localhost:4321` |
| `npm run build`   | Build the production site to `dist/`        |
| `npm run preview` | Serve the built `dist/` locally             |

## Editing products

Each product is one Markdown file, with its photos in a folder of the same name:

```
src/content/products/heritage-square-litter-bin.md     ← details + description
src/assets/products/heritage-square-litter-bin/        ← photos
```

The file name is the product's URL (`heritage-square-litter-bin.md` → `/heritage-square-litter-bin/`), so don't
change it once the page is live. A product file looks like:

```markdown
---
name: Heritage Square Litter Bin
code: 81705/301                       # optional product code
categories:                           # where it's listed — see categories.json
  - recycle-hub/litter-bins
images:                               # files in src/assets/products/<file name>/; the first is the main photo
  - heritage-square.jpg
  - heritage-square-open.jpg
specs:                                # optional, shown as a table
  Capacity: 110 litres
  Height: 1156 mm
options:                              # optional, the customer picks one of each
  - name: Body Colour
    choices:
      - { name: Black, colour: "#2D2926" }     # a colour swatch
      - { name: Signal Red, colour: "#D42E12" }
  - name: Bin Liner
    choices:
      - Plastic Bin Liner (110 litres)         # a plain choice
      - Galvanised Bin Liner (110 litres)
  - name: Seagull Flaps
    optional: true                             # adds a "None" choice
    choices: [Single Seagull Flap, Dual Seagull Flaps]
extras:                               # optional, tick-box add-ons
  - Fixing Bolts
  - Ashtray
---

The description, in Markdown. **Bold**, lists and `## headings` all work.
```

**To add a product**, copy an existing file, change the details, and drop its photos in a matching folder under
`src/assets/products/`. Upload photos as they are — the build resizes them and converts them to WebP. Products with
no `images` show a "Photo coming soon" tile.

## Editing categories

All categories are in [`src/content/categories.json`](src/content/categories.json). The `id` is the category's URL
(`recycle-hub/litter-bins` → `/recycle-hub/litter-bins/`), `parent` is the id of the category it sits under, and
`order` sets its position among its siblings. A product listed in a sub-category automatically shows in every
category above it, so list only the most specific ones.

Categories with no products show a "Coming soon — get in touch" message and are left out of the menus.

The top-level departments, the waste streams on the home page and the home page's popular products are set in
[`src/consts.ts`](src/consts.ts).

The build checks the content and stops with a message naming the file to fix if, say, a photo is missing or a
product is listed in a category that doesn't exist. Editing a file directly on GitHub works fine — the site
rebuilds on commit and the Actions tab shows if anything needs fixing.

## Business details

Phone, email and address live in [`src/consts.ts`](src/consts.ts). The visible copy and the structured data are
both generated from it.

## Old BigCommerce links

Product and category URLs are the same as on the old BigCommerce shop (`/<product>/`, `/<category>/<sub-category>/`),
so existing links and search rankings carry over. Shop-only pages such as `/cart.php` and `/login.php` show the 404
page.

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site
and publishes it to GitHub Pages. The custom domain is set by [`public/CNAME`](public/CNAME).
