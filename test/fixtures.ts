import { Writable } from "stream";
import { stripVTControlCharacters } from "util";

import createMetascraper from "metascraper";
import { test as baseTest } from "vitest";

import ecommerce from "../src/index.js";

export const test = baseTest
    // oxlint-disable-next-line no-empty-pattern
    .extend("getLogs", { auto: true }, ({}, { onCleanup }) => {
        const logs = captureDebugLogs();
        onCleanup(logs.restore);
        return logs.getLogs;
    })
    .extend("scraper", () => {
        return createMetascraper([ecommerce()]);
    });

function captureDebugLogs() {
    const stderr: string[] = [];

    const streams = {
        stderr: new Writable({
            write(chunk, encoding, callback) {
                stderr.push(chunk.toString());
                callback();
            },
        }),
    };

    // oxlint-disable-next-line typescript/unbound-method
    const originalStderrWrite = process.stderr.write;
    process.stderr.write = streams.stderr.write.bind(streams.stderr);

    return {
        restore: () => {
            process.stderr.write = originalStderrWrite;
        },
        getLogs: () => {
            return {
                stderr: stderr
                    .map(stripVTControlCharacters)
                    .map((s) => s.trim())
                    .map((s) => s.split(" ")),
            };
        },
    };
}
