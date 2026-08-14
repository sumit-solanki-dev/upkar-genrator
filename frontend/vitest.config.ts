import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**"],
    globals: true,
    passWithNoTests: true,
    restoreMocks: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
