import { $jsonld } from "@metascraper/helpers";

import { toPriceFormat } from "./helpers.js";
import createSites from "./sites/index.js";
import type { EcommerceMetadataRules } from "./types.js";

/**
 * A set of rules we want to declare under the `metascraper-ecommerce` namespace.
 *
 **/
export default () => {
    const sites = createSites();
    const rules: EcommerceMetadataRules = {
        brand: [...sites.brand, ({ htmlDom: $ }) => $jsonld("brand.name")($), ({ htmlDom: $ }) => $jsonld("brand")($)],
        name: [
            ...sites.name,
            ({ htmlDom: $ }) => $jsonld("name")($),
            ({ htmlDom: $ }) => $('[property="og:title"]').prop("content")?.trim(),
            ({ htmlDom: $ }) => $("#productTitle").prop("innerText")?.trim(), // amazon
        ],
        url: [
            ...sites.url,
            ({ url }) => url, // We'll trust the url the user provides as it may have additional product metadata
        ],
        image: [
            ...sites.image,
            ({ htmlDom: $ }) => $('[property="og:image:secure_url"]').attr("content"),
            ({ htmlDom: $, url }) => {
                const image = $('[property="og:image"]').attr("content");
                const protocol = new URL(url).protocol;

                try {
                    if (image) new URL(image); //catch if not a valid URL and assume it's because of protocol
                } catch {
                    if (image) return `${protocol}${image}`;
                }

                if (image) return image;
            },
            ({ htmlDom: $ }) => $jsonld("image.image")($),
            ({ htmlDom: $ }) => $jsonld("image.url")($),
            ({ htmlDom: $ }) => $jsonld("image.0")($),
            ({ htmlDom: $ }) => $jsonld("image")($),
            ({ htmlDom: $ }) => $('meta.swiftype[name="image"]').attr("content"),
        ],
        currency: [
            ...sites.currency,
            ({ htmlDom: $ }) => $('[property="og:price:currency"]').attr("content"),
            ({ htmlDom: $ }) => $("[itemprop=priceCurrency]").prop("innerText")?.trim(), // walmart ?
            ({ htmlDom: $ }) => $jsonld("offers.priceCurrency")($),
            ({ htmlDom: $ }) => $jsonld("offers.0.priceCurrency")($),
            ({ htmlDom: $ }) => $('[property="product:price:currency"]').attr("content"),
        ],
        sku: [
            ...sites.sku,
            ({ htmlDom: $ }) => $jsonld("sku")($),
            ({ htmlDom: $ }) => $jsonld("offers.sku")($),
            ({ htmlDom: $ }) => $jsonld("offers.0.sku")($),
            ({ htmlDom: $ }) => $("[itemprop=sku]").html(),
        ],
        price: [
            ...sites.price,
            ({ htmlDom: $ }) => toPriceFormat($('[property="og:price:amount"]').attr("content")),
            ({ htmlDom: $ }) => toPriceFormat($("[itemprop=price]").first().text().trim()), // walmart ?
            ({ htmlDom: $ }) => toPriceFormat($('[property="product:price:amount"]').attr("content")),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("price")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("offers.price")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("offers.0.price")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("0.offers.price")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("offers.lowPrice")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("offers.0.lowPrice")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("offers.highPrice")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("offers.0.highPrice")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("hasVariant.offers.price")($)),
            ({ htmlDom: $ }) => toPriceFormat($jsonld("hasVariant.offers.0.price")($)),
            ({ htmlDom: $ }) => toPriceFormat($("#attach-base-product-price").attr("value")),
            ({ htmlDom: $ }) => toPriceFormat($("span.price-amount").html()),
        ],
        retailer: [
            ...sites.retailer,
            ({ htmlDom: $ }) => $('[property="og:site_name"]').attr("content"),
            ({ htmlDom: $ }) => $jsonld("seller.name")($),
        ],
    };
    rules.pkgName = "metascraper-ecommerce";
    return rules;
};
