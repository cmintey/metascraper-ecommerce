import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ["./test/reporters/StatsReporter.ts"],
    },
});
