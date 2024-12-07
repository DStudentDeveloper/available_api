import globals from "globals";
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Define the environment
  {
    languageOptions: {
      globals: globals.node, // Adjust this if you also need browser globals
    },
  },

  // Include ESLint's recommended rules
  pluginJs.configs.recommended,

  // Add Prettier plugin and rules
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Disable ESLint rules that conflict with Prettier
      "prettier/prettier": "error", // Treat Prettier issues as errors
    },
  },
];
