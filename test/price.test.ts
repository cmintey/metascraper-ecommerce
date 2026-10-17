import { expect } from "vitest";

import { test } from "./fixtures.js";
import { useData } from "./util.js";

test("price with commas", async ({ scraper }) => {
    const html = await useData("meta_og_price.html");
    const url = "https://www.example.com/";
    const metadata = await scraper({ html, url });
    expect(metadata.price).toBe("2699.00");
});

test("price with dots for readability and comma to separate cents", async ({ scraper }) => {
    const html = await useData("meta_og_price_euro.html");
    const url = "https://www.example.com";
    const metadata = await scraper({ html, url });
    expect(metadata.price).toBe("2699.00");
});

test("jsonld product with single offer", async ({ scraper }) => {
    const html = await useData("jsonld_offer_single.html");
    const url = "https://www.example.com";
    const metadata = await scraper({ html, url });
    expect(metadata.price).toBe("119.99");
    expect(metadata.currency).toBe("USD");
});

test("jsonld product with variants -- nested", async ({ scraper }) => {
    const html = await useData("jsonld_variants_nested.html");
    const url = "https://www.example.com";
    const metadata = await scraper({ html, url });
    expect(metadata.price).toBe("39.99");
    expect(metadata.currency).toBe("USD");
});

test("jsonld product with variants -- flat", async ({ scraper }) => {
    const html = await useData("jsonld_variants_flat.html");
    const url = "https://www.example.com";
    const metadata = await scraper({ html, url });
    expect(metadata.price).toBe("39.99");
    expect(metadata.currency).toBe("USD");
    expect(metadata.brand).toBe("Good brand");
});
