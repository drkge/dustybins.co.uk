// Reads the category and product files and joins them up, so pages only deal
// with ready-to-render data. Mistakes in the content (a missing photo, a
// product listed in a category that doesn't exist, a parent that doesn't
// exist) fail the build with a message saying which file to fix.

import type { ImageMetadata } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { DEPARTMENTS } from "@/consts";

type ProductEntry = CollectionEntry<"products">;

export type Category = {
  id: string;
  href: string;
  title: string;
  description?: string;
  order: number;
  parent?: Category;
  children: Category[];
  /** Products listed here or in any sub-category, without duplicates. */
  products: Product[];
};

export type Product = ProductEntry["data"] & {
  id: string;
  href: string;
  entry: ProductEntry;
  /** The categories it's listed in (the deepest ones). */
  listedIn: Category[];
  /** Resolved photos; empty when the product has no photo yet. */
  photos: ImageMetadata[];
};

const imageFiles = import.meta.glob<ImageMetadata>("/src/assets/products/*/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

function resolveImage(productId: string, file: string) {
  const image = imageFiles[`/src/assets/products/${productId}/${file}`];
  if (!image) {
    throw new Error(
      `Image "${file}" not found. Put it in src/assets/products/${productId}/ ` +
        `or fix the name in src/content/products/${productId}.md.`,
    );
  }
  return image;
}

/** Natural order, so "80 Litre" comes before "120 Litre". */
const collator = new Intl.Collator("en-GB", { numeric: true, sensitivity: "base" });

type Catalog = { categories: Category[]; byId: Map<string, Category>; products: Product[] };
let cache: Catalog | undefined;

async function load(): Promise<Catalog> {
  if (cache) return cache;

  const categoryEntries = await getCollection("categories");
  const categories: Category[] = categoryEntries.map((entry) => ({
    id: entry.id,
    href: `/${entry.id}/`,
    title: entry.data.title,
    description: entry.data.description,
    order: entry.data.order,
    children: [],
    products: [],
  }));
  const byId = new Map(categories.map((category) => [category.id, category]));

  for (const entry of categoryEntries) {
    if (!entry.data.parent) continue;
    const parent = byId.get(entry.data.parent);
    if (!parent) {
      throw new Error(`Category "${entry.id}" has parent "${entry.data.parent}", which isn't in categories.json.`);
    }
    const category = byId.get(entry.id)!;
    category.parent = parent;
    parent.children.push(category);
  }
  for (const category of categories) category.children.sort((a, b) => a.order - b.order);

  const products: Product[] = (await getCollection("products"))
    .map((entry): Product => {
      const listedIn = entry.data.categories.map((id) => {
        const category = byId.get(id);
        if (!category) {
          throw new Error(`src/content/products/${entry.id}.md lists category "${id}", which isn't in categories.json.`);
        }
        return category;
      });
      return {
        ...entry.data,
        id: entry.id,
        href: `/${entry.id}/`,
        entry,
        listedIn,
        photos: entry.data.images.map((file) => resolveImage(entry.id, file)),
      };
    })
    .sort((a, b) => collator.compare(a.name, b.name));

  for (const id of products.map((p) => p.id)) {
    if (byId.has(id)) throw new Error(`"${id}" is both a product and a category. Rename one of them.`);
  }

  for (const product of products) {
    const into = new Set<Category>();
    for (let category of product.listedIn) {
      for (let c: Category | undefined = category; c; c = c.parent) into.add(c);
    }
    for (const category of into) category.products.push(product);
  }

  cache = { categories, byId, products };
  return cache;
}

export async function getCategories() {
  return (await load()).categories;
}

export async function getCategory(id: string) {
  const category = (await load()).byId.get(id);
  if (!category) throw new Error(`No category "${id}" in categories.json.`);
  return category;
}

/** The top-level departments, in the order set in consts.ts. */
export async function getDepartments() {
  return Promise.all(DEPARTMENTS.map(getCategory));
}

export async function getProducts() {
  return (await load()).products;
}

/** From the department down to this category. */
export function ancestry(category: Category) {
  const chain: Category[] = [];
  for (let c: Category | undefined = category; c; c = c.parent) chain.unshift(c);
  return chain;
}

/** Sub-categories worth linking to: ones with something in them. */
export function stockedChildren(category: Category) {
  return category.children.filter((child) => child.products.length > 0);
}

/** The first photo of the first product that has one, for category cards. */
export function coverImage(category: Category) {
  return category.products.find((product) => product.photos.length)?.photos[0];
}

/** The category a product "belongs" to for breadcrumbs: its first listed one. */
export function primaryCategory(product: Product) {
  return product.listedIn[0];
}

/** Colour swatches from a product's first colour option, for cards. */
export function swatches(product: Product) {
  for (const option of product.options) {
    const colours = option.choices.filter((choice) => typeof choice !== "string");
    if (colours.length) return colours;
  }
  return [];
}

/** Capacity for cards, when it's short enough to fit ("1100 Litres", not a sentence). */
export function shortCapacity(product: Product) {
  const capacity = product.specs["Capacity"];
  return capacity && capacity.length <= 16 ? capacity : undefined;
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
