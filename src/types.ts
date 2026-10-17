import type { Rules, RulesOptions } from "metascraper";

export interface EcommerceMetadataRules extends Rules {
    brand: Array<RulesOptions>;
    name: Array<RulesOptions>;
    image: Array<RulesOptions>;
    currency: Array<RulesOptions>;
    sku: Array<RulesOptions>;
    price: Array<RulesOptions>;
    retailer: Array<RulesOptions>;
    url: Array<RulesOptions>;
}
