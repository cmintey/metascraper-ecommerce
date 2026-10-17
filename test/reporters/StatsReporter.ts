import { DefaultReporter, type TestModule, type SerializedError, type TestRunEndReason } from "vitest/node";

export default class StatsReporter extends DefaultReporter {
    onTestRunEnd(
        testModules: ReadonlyArray<TestModule>,
        unhandledErrors: ReadonlyArray<SerializedError>,
        reason: TestRunEndReason,
    ): void {
        const statMap = new Map<string, number>();

        testModules.forEach((mod) => {
            mod.children
                .allTests()
                .filter((tst) => tst.meta().rules !== undefined)
                .flatMap((tst) => tst.meta().rules!.filter((r) => r !== undefined))
                .forEach((rule) => {
                    const stat = statMap.get(rule);
                    if (stat) {
                        statMap.set(rule, stat + 1);
                    } else {
                        statMap.set(rule, 1);
                    }
                });
        });

        console.log(statMap.entries());

        super.onTestRunEnd(testModules, unhandledErrors, reason);
    }
}
