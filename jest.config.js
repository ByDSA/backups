/** @type {import('jest').Config} */

import { existsSync } from "node:fs";
import { join } from "node:path";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const coverageThresholdProduction = {
  global: {
    branches: 50,
    functions: 50,
    lines: 80,
    statements: 80,
  },
};
const coverageThresholdDev = {
  global: {
  },
};
const setupFilesAfterEnv = [
];
const moduleNameMapper = {
  // 1. Quitar la extensión .js de los alias #/
  "^#/(.*)\\.js$": "<rootDir>/src/$1",
  "^#/(.*)$": "<rootDir>/src/$1",

  // 2. Quitar la extensión .js de los alias #tests/
  "^#tests/(.*)\\.js$": "<rootDir>/tests/$1",
  "^#tests/(.*)$": "<rootDir>/tests/$1",

  // 3. Quitar extensión .js de imports relativos (./...js o ../...js)
  "^(\\.{1,2}/.*)\\.js$": "$1",
};
const testsFolder = join(import.meta.dirname, "tests");

if (existsSync(testsFolder)) {
  const setupPath = join(testsFolder, "setup.js");

  if (existsSync(setupPath))
    setupFilesAfterEnv.push("<rootDir>/tests/setup.js");

  moduleNameMapper["^~tests($|/.*)$"] = "<rootDir>/tests/$1";
}

const config = {
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleDirectories: [
    "node_modules",
    "src",
  ],
  globals: {
  },
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      useESM: true,
    }],
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv,
  moduleNameMapper: {
    ...moduleNameMapper,
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  coverageThreshold: coverageThresholdDev,
};

export default config;
