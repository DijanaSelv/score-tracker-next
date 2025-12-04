import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // allow 'any' type
      "@typescript-eslint/no-explicit-any": "off",

      // allow functions without explicit return types
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // allow non-null assertions
      "@typescript-eslint/no-non-null-assertion": "off",

      // optionally relax some React-specific warnings
      "react/prop-types": "off",
    },
  },
];

export default eslintConfig;
