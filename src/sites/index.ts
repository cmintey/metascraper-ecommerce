import type { RulesOptions, Test } from "metascraper";

import type { EcommerceMetadataRules } from "../types.js";
import amazon from "./amazon.js";

const sites: CustomSite[] = [amazon];

export interface SiteRules extends Partial<Omit<EcommerceMetadataRules, "pkgName">> {}

export interface CustomSite {
    rules: SiteRules;
    test: Test;
}

export function buildSiteRules(site: CustomSite) {
    function addTestToRule(ruleSet: RulesOptions) {
        ruleSet.test = site.test;
    }

    Object.values(site.rules).forEach((ruleSet) => {
        if (Array.isArray(ruleSet)) {
            ruleSet.forEach((r) => addTestToRule(r));
        }
        if ((ruleSet as RulesOptions).apply !== undefined) {
            addTestToRule(ruleSet as RulesOptions);
        }
    });
    return site.rules;
}

function emptyRuleSet() {
    return {
        price: [],
        brand: [],
        name: [],
        image: [],
        currency: [],
        sku: [],
        retailer: [],
        url: [],
    } as EcommerceMetadataRules;
}

function collapse(objects: SiteRules[]) {
    return objects.reduce((result, obj) => {
        for (const [_key, _value] of Object.entries(obj)) {
            const key = _key as keyof SiteRules;
            const value = _value as Array<RulesOptions> | undefined;

            // We know we've initialized our object with empty arrays already
            const currValue = result[key] as RulesOptions[];
            result[key] = [...currValue, ...(value || [])];
        }
        return result;
    }, emptyRuleSet()) as EcommerceMetadataRules;
}

export default () => collapse(sites.map(buildSiteRules));
