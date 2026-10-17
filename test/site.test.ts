import { test } from "./fixtures.js";
import { useSite, useSites } from "./util.js";

test.for(useSites())("site: $sitename", async ({ sitename, url, expectedData }, { expect, task, scraper, getLogs }) => {
    const html = await useSite(sitename);
    const metadata = await scraper({ html, url });

    const matchedRules = getLogs()
        .stderr.filter((logMsg) => logMsg[0] === "metascraper:find-rule")
        .filter((logMsg) => logMsg[1]?.endsWith("true"))
        .map((logMsg) => logMsg[1]?.replace(":true", ""))
        .filter((rule) => rule !== undefined)
        .toSorted();
    console.log(matchedRules);
    task.meta.rules = matchedRules;

    expect(metadata.name).toBe(expectedData.name);
    expect(metadata.brand).toBe(expectedData.brand);
    expect(metadata.currency).toBe(expectedData.currency);
    expect(metadata.price).toBe(expectedData.price);
    expect(metadata.image).toBe(expectedData.image);
    expect(metadata.retailer).toBe(expectedData.retailer);
});
