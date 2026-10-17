import { defineConfig } from "tsdown";

export default defineConfig({
    entry: "src/index.ts",
    deps: {
        neverBundle: ["@metascraper/helpers"],
    },
    tsconfig: "./tsconfig.build.json",
});
