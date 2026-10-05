import { file, glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

/** A category's URL path, e.g. "recycle-hub/litter-bins". */
const categoryPath = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/, "use lowercase letters, numbers, hyphens and slashes");

// Every category in one file. The id is the page's URL (/recycle-hub/litter-bins/).
const categories = defineCollection({
  loader: file("./src/content/categories.json"),
  schema: z.object({
    title: z.string(),
    /** The id of the category this one sits under. Leave out for a top-level department. */
    parent: categoryPath.optional(),
    /** One or two sentences: shown under the heading and used as the meta description. */
    description: z.string().optional(),
    /** Position among its siblings (lower comes first). */
    order: z.number(),
  }),
});

const choice = z.union([
  z.string(),
  /** A colour swatch. */
  z.object({ name: z.string(), colour: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }),
]);

// One Markdown file per product. The file name is the product's URL
// (/heritage-square-litter-bin/) and the body is its description.
const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "*.md" }),
  schema: z.object({
    name: z.string(),
    /** Product code / SKU, shown on the page and in enquiries. */
    code: z.string().optional(),
    /** The categories it's listed in. It also shows in their parent categories automatically. */
    categories: z.array(categoryPath).min(1),
    /** File names inside src/assets/products/<file name>/. The first is the main photo. */
    images: z.array(z.string()).default([]),
    /** Shown as a table, e.g. { Capacity: "1100 Litres", Height: "1410 mm" }. */
    specs: z.record(z.string()).default({}),
    /** Choices the customer picks from, e.g. body colour. They go into the enquiry email. */
    options: z
      .array(
        z.object({
          name: z.string(),
          /** True if "none" is a valid answer. */
          optional: z.boolean().default(false),
          choices: z.array(choice).min(1),
        }),
      )
      .default([]),
    /** Optional add-ons the customer can tick, e.g. "Lid Lock". */
    extras: z.array(z.string()).default([]),
  }),
});

export const collections = { categories, products };
