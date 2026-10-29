import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // ── Clean Architecture boundary rules (docs/Refactoring Plan.md §3.2) ──────
  // The Domain layer must stay pure TypeScript: no framework, no state
  // management, no data fetching, no concrete infrastructure.
  {
    files: ["src/features/*/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "next/*", "react-redux", "@reduxjs/toolkit"],
              message: "Domain layer must be framework-free (no React/Next/Redux).",
            },
            {
              group: ["**/infrastructure/**", "**/presentation/**", "**/composition/**"],
              message: "Domain must not depend on outer layers (infrastructure/presentation/composition).",
            },
          ],
        },
      ],
    },
  },
  // Use Cases depend on the Domain and repository interfaces only — never on
  // concrete infrastructure, presentation, or framework code.
  {
    files: ["src/features/*/use-cases/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "next/*", "react-redux", "@reduxjs/toolkit"],
              message: "Use cases must not depend on React/Next/Redux.",
            },
            {
              group: ["**/infrastructure/**", "**/presentation/**", "**/composition/**"],
              message: "Use cases must depend on repository interfaces, not outer layers.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
