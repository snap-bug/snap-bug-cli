import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {},
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
      "prefer-const": "warn",
      "no-magic-numbers": ["warn", { ignore: [0, 1] }],
    },
  },
];
