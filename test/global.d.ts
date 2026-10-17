export * from "vitest";

declare module "vitest" {
    interface TaskMeta {
        rules?: string[];
    }
}
