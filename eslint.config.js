import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // Base config: JS & JSX
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Example tweak
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // Tests: WDIO + Mocha globals only under /test
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.mocha,
        browser: "readonly",
        $: "readonly",
        $$: "readonly",
      },
    },
  },

  // Prettier integration — disables ESLint stylistic rules
  eslintConfigPrettier,

  // Ignore generated stuff
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },
];
