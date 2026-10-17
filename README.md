# metascraper-ecommerce

> A custom rule bundle for [@microlinkhq/metascraper](https://github.com/microlinkhq/metascraper) to get product information from HTML markup on merchant websites

## Install

```bash
$ npm install @cmintey/metascraper-ecommerce
```

## Usage

```typescript
import ecommerce from "@cmintey/metascraper-ecommerce";
import { Impit } from "impit";
import createMetascraper from "metascraper";

const metascraper = createMetascraper([ecommerce()]);

// Use whatever method you want to fetch HTML
const impit = new Impit({
    browser: "chrome",
    vanillaFallback: true,
});

const html = await impit.fetch(url).then((resp) => resp.text());
const metadata = await metascraper({
    url,
    html,
});

console.log(metadata);
/*
metadata: {
  name:         [String]
  image:        [String]
  url:          [String]
  price:        [String]
  currency:     [String]
  brand:        [String]
  retailer:     [String]
  sku:          [String]
}
*/
```

## License

**@cmintey/metascraper-ecommerce** © 2026 Carter Mintey, Released under the [MIT](https://github.com/cmintey/metascraper-ecommerce/blob/master/LICENSE.md) License.

Original source adapted from **@samirrayani/metascraper-shopping** © 2019-2026 Samir Rayani, Released under the [MIT](https://github.com/samirrayani/metascraper-shopping/blob/master/LICENSE.md) License.
