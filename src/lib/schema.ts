import { SITE_URL } from "@/consts";

export type Crumb = { name: string; href: string };

/** BreadcrumbList JSON-LD for the same trail the page shows visibly. */
export function breadcrumbList(trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.href, SITE_URL).href,
    })),
  };
}
