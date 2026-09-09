import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginRouter from "@tanstack/eslint-plugin-router";
import prettier from "eslint-config-prettier";

export default defineConfig([
  // Build output and generated files are not ours to lint.
  globalIgnores([
    "dist/**",
    ".output/**",
    ".tanstack/**",
    ".nitro/**",
    "src/routeTree.gen.ts",
  ]),

  pluginRouter.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  // React 19 auto-imports JSX; no `import React` needed.
  pluginReact.configs.flat["jsx-runtime"],

  {
    files: ["**/*.{ts,tsx}"],
    settings: { react: { version: "detect" } },
    rules: {
      // TypeScript already checks props.
      "react/prop-types": "off",

      // Quotes and apostrophes in JSX text are fine.
      "react/no-unescaped-entities": "off",

      // Warn, and let a leading underscore mean "on purpose".
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // Worth fixing, never worth blocking on.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },

  // Last, so it wins: turns off every rule that would argue with prettier.
  prettier,
]);
