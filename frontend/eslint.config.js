import eslint from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const appFiles = ["app/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}"];
const nodeFiles = [
  "*.config.ts",
  "e2e/**/*.ts",
  "react-router.config.ts",
  "vite.config.ts",
  "vitest.config.ts",
];
const javascriptConfigFiles = ["eslint.config.js"];

const routeModuleExports = [
  "action",
  "clientAction",
  "clientLoader",
  "ErrorBoundary",
  "handle",
  "headers",
  "HydrateFallback",
  "links",
  "loader",
  "meta",
  "shouldRevalidate",
];

export default tseslint.config(
  {
    ignores: [
      ".react-router/**",
      "build/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "public/**",
      "src/**",
      "test-results/**",
    ],
  },
  {
    ...eslint.configs.recommended,
    files: [...appFiles, ...nodeFiles, ...javascriptConfigFiles],
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: [...appFiles, ...nodeFiles],
  })),
  { ...reactHooks.configs.flat.recommended, files: ["app/**/*.{ts,tsx}"] },
  { ...jsxA11y.flatConfigs.recommended, files: ["app/**/*.tsx"] },
  {
    ...reactRefresh.configs.vite,
    files: ["app/**/*.tsx"],
    rules: {
      ...reactRefresh.configs.vite.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowExportNames: routeModuleExports },
      ],
    },
  },
  {
    files: appFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["app/routes/**/*.{ts,tsx}"],
    rules: {
      // React Router route modules intentionally throw Response values for
      // redirects and HTTP error boundaries.
      "@typescript-eslint/only-throw-error": "off",
    },
  },
  {
    files: nodeFiles,
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["e2e/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: javascriptConfigFiles,
    languageOptions: {
      globals: globals.node,
    },
  },
);
