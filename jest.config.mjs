// jest.config.mjs
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",

  // Cross-platform test matching for App Router conventions
  testMatch: [
    "**/__tests__/**/*.(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
    // Explicitly support App Router patterns with escaped brackets
    "**/app/**/*.(test|spec).(js|jsx|ts|tsx)"
  ],

  moduleNameMapper: {
    // Static assets
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "^.+\\.(svg)$": "<rootDir>/__mocks__/svg.tsx",

    // Path aliases - matching actual project structure with cross-platform support
    "@/(.*)$": "<rootDir>/$1",
    "@/components(.*)$": "<rootDir>/components/$1",
    "@/styles(.*)$": "<rootDir>/styles/$1",
    "@/routes(.*)$": "<rootDir>/routes/$1",
    "@/utils(.*)$": "<rootDir>/utils/$1",
    "@/types(.*)$": "<rootDir>/types/$1",
    "@/context(.*)$": "<rootDir>/context/$1",
    "@/hooks(.*)$": "<rootDir>/hooks/$1",

    // App Router dynamic routes - normalize path separators
    "^app/(.*)$": "<rootDir>/app/$1",
    "^app\\\\(.*)$": "<rootDir>/app/$1", // Windows backslash support

    // Specific dynamic route patterns for better Windows compatibility
    "^app/\\[(.*)\\]/(.*)$": "<rootDir>/app/[$1]/$2"
  },

  // Cross-platform transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }]
  },

  // Coverage configuration (informational only — not an enforced gate)
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    // Business logic and components - platform-agnostic patterns
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "context/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "utils/**/*.{js,jsx,ts,tsx}",

    // Exclusions
    "!**/*.stories.{js,jsx,ts,tsx}",
    "!**/__tests__/**",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/*.spec.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**"
  ],

  // Performance optimizations
  coverageProvider: "v8",
  maxWorkers: "50%",
  workerIdleMemoryLimit: "256MB",
  testTimeout: 10000,

  // Cross-platform resolver configuration
  resolver: undefined,
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],

  // Platform-specific configuration
  ...(process.platform === "win32" && {
    // Windows-specific workarounds for bracket paths
    transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$|@testing-library))"],
    testPathIgnorePatterns: [
      "<rootDir>/.next/",
      "<rootDir>/node_modules/",
      // Windows path separator handling
      "<rootDir>\\\\.next\\\\",
      "<rootDir>\\\\node_modules\\\\"
    ]
  })
};

export default createJestConfig(config);
