import { readFile } from "fs/promises";
import path from "path";

import { assert } from "vitest";

import sites from "./data/sites/index.js";

const baseDir = path.normalize(__dirname);

export async function useData(filename: string) {
    assert(filename !== null);

    const filepath = path.normalize(baseDir + "/data/" + filename);
    assert(filepath !== null);

    const contents = await readFile(filepath, { encoding: "utf8" });
    assert(contents !== null);

    return contents;
}

export function useSites() {
    return sites;
}

export async function useSite(sitename: string) {
    return useData("/sites/" + sitename + ".html");
}
