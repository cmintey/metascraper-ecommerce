import { toPriceFormat } from "../helpers.js";
import type { CustomSite, SiteRules } from "./index.js";

const rules: SiteRules = {
    price: [({ htmlDom: $ }) => toPriceFormat($("span.a-offscreen", "span.a-price").html())],
    image: [({ htmlDom: $ }) => $("div#imgTagWrapperId img").attr("src")],
    currency: [({ htmlDom: $ }) => $("#attach-currency-of-preference").attr("value")],
};

export default {
    rules,
    test: ({ url }) => url.includes("amazon"),
} as CustomSite;
