import {readFileSync} from "node:fs";

const sharedListingCss = readFileSync("src/app/image-quality.css", "utf8");
const catalogCss = readFileSync("src/app/san-pham/catalog.module.css", "utf8");
const sharedGuard = ".product-grid > .product { grid-column: auto; grid-row: auto; }";
const catalogGuard = ".grid > .product {\n  grid-column: auto;\n  grid-row: auto;\n}";

if (!sharedListingCss.includes(sharedGuard) || !catalogCss.includes(catalogGuard)) {
  throw new Error("Listing grid guard is missing. Product cards must use automatic grid placement.");
}

console.log("Listing grid guard verified: product cards use automatic placement.");
