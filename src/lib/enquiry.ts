import { BUSINESS } from "@/consts";

type Enquirable = {
  name: string;
  code?: string;
};

/**
 * A mailto: link with the product already filled in, so the customer only adds
 * a quantity and postcode. `choices` are the options picked on the product
 * page, e.g. [["Body Colour", "Blue"], ["Extras", "Lid Lock"]].
 * Kept free of Astro imports so the product page's script can use it too.
 */
export function enquiryMailto(product: Enquirable, choices: [string, string][] = [], quantity = "") {
  const label = product.code ? `${product.name} (${product.code})` : product.name;
  const lines = [
    "Hello,",
    "",
    "Could you send me a quote for:",
    "",
    `Product: ${product.name}`,
    ...(product.code ? [`Code: ${product.code}`] : []),
    ...choices.map(([name, value]) => `${name}: ${value}`),
    `Quantity: ${quantity}`,
    "Delivery postcode: ",
    "",
    "Thanks,",
  ];
  const params = `subject=${encodeURIComponent(`Enquiry: ${label}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
  return `mailto:${BUSINESS.email}?${params}`;
}
