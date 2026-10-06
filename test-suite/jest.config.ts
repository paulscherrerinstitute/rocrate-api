import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./src",
  testTimeout: 5 * 60 * 1000,
};

export default config;
