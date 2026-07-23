import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  js.configs.recommended,
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "jest.setup.ts"],
    languageOptions: {
      globals: {
        jest: "readonly"
      }
    }
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".pnpm-store/**",
      "cache/**",
      "public/**",
      "coverage/**",
      "commitlint.config.mjs",
      "**/*.d.ts",
      "**/.swc/**"
    ]
  }
];

export default eslintConfig;
