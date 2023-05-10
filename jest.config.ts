import { existsSync } from "fs";
import { Config } from "jest";
import { join } from "path";

const coverageThreshold: Config["coverageThreshold"] = {
  global: {
    branches: 50,
    functions: 50,
    lines: 80,
    statements: 80,
  },
};
const setupFilesAfterEnv: Config["setupFilesAfterEnv"] = [
];
const moduleNameMapper: Config["moduleNameMapper"] = {
  "^~($|/.*)$": "<rootDir>/src/$1",
  "^#tests($|/.*)$": "<rootDir>/tests/$1",
};
const testsFolder = join(__dirname, "tests");

if (existsSync(testsFolder)) {
  const setupPath = join(testsFolder, "setup.js");

  if (existsSync(setupPath))
    setupFilesAfterEnv.push("<rootDir>/tests/setup.js");

  moduleNameMapper["^~tests($|/.*)$"] = "<rootDir>/tests/$1";
}

const config: Config = {
  moduleDirectories: [
    "node_modules",
    "src",
  ],
  globals: {
  },
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": require.resolve("babel-jest"),
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv,
  moduleNameMapper,
  coverageThreshold,
};

export default config;
