declare module "@metascraper/helpers" {
    import type { RulesTestOptions } from "metascraper";

    type HtmlDomType = RulesTestOptions["htmlDom"];

    export function $jsonld(path: string): ($: HtmlDomType) => string | null | undefined;
}
