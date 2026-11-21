/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Specifying test environment
  preset: "ts-jest",
  testEnvironment: "node",

  // Test file matching patterns
  testMatch: ["**/__tests__/**/*.test.ts"],

  // Test coverage configuration
  coverageDirectory: "coverage",
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "clover", "json", "html"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/types/**/*.ts",
    "!src/scripts/**/*.ts",
  ],

  // Module path mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Setup to run before each test
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],

  // Transformer configuration
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Test environment variables
  testEnvironmentOptions: {
    NODE_ENV: "test",
  },
  
  // Ignore specific paths
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
