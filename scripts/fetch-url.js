import { writeFile } from "fs/promises";
import path from "path";

import { Impit } from "impit";
import createMetascraper from "metascraper";
import puppeteer from "puppeteer";

import shopping from "../dist/index.js";

const baseDir = path.normalize(import.meta.dirname);

async function fetchQuick(url) {
    const impit = new Impit({
        browser: "chrome",
        vanillaFallback: true,
    });

    const response = await impit.fetch(url);
    if (response.status !== 200) {
        console.log("Page returned status " + response.status);
        return null;
    }
    return await response.text();
}

async function fetchFull(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("Navigating to page");
    await page.goto(url, { waitUntil: "networkidle2" });

    console.log("Waiting for content");
    const html = await page.evaluate(() => document.body.innerHTML);
    await browser.close();
    return html;
}

async function fetchPage(sitename, url) {
    console.log("Fetching webpage for " + sitename);

    let html = await fetchQuick(url);

    if (html === null) {
        console.log("Trying puppeteer...");
        html = await fetchFull(url);
    }
    if (html === null) {
        return;
    }

    const metascraper = createMetascraper([shopping()]);
    let metadata = await metascraper({
        url,
        html,
    });

    if (
        metadata.name === null &&
        metadata.price === null &&
        metadata.currency === null &&
        metadata.brand === null &&
        metadata.image === null &&
        metadata.retailer === null
    ) {
        console.log("No metadata found, trying puppeteer");
        html = await fetchFull(url);
        metadata = await metascraper({
            url,
            html,
        });
    }

    const filepath = path.normalize(baseDir + "/../test/data/sites/" + sitename + ".html");
    console.log("Persisting HTML to " + filepath);

    await writeFile(filepath, html);

    console.log("Paste this entry into sites/index.ts");

    console.log(
        JSON.stringify({
            sitename,
            url,
            expectedData: {
                name: metadata.name,
                price: metadata.price,
                currency: metadata.currency,
                brand: metadata.brand,
                image: metadata.image,
                retailer: metadata.retailer,
            },
        }),
    );

    console.log("Done.");
}

function printHelp() {
    console.log("Usage: node fetch-url.js <sitename> <url>");
}

if (process.argv?.length < 4) {
    printHelp();
    process.exit(1);
}

const sitename = process.argv[2];
const url = process.argv[3];
await fetchPage(sitename, url);
