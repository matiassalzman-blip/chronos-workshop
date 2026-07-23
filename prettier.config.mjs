const prettierConfig = {
  printWidth: 80,
  semi: true,
  arrowParens: "always",
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  endOfLine: "lf",
  quoteProps: "as-needed",
  trailingComma: "none",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./styles/globals.css"
};

export default prettierConfig;
