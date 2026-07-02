export enum TestingEnv {
  PSI = "https://scicat-exporter.development.psi.ch/api/v1/ro-crate",
  OPENBIS = "https://openbis-sis-ci-sprint-public.ethz.ch/ro-crate-server",
  LOCAL = "http://localhost:8080/api/v1/ro-crate",
}

const testEnv = process.env.TEST_ENV || "";
if (!Object.keys(TestingEnv).includes(testEnv)) {
  throw new Error(
    `Invalid TEST_ENV value: ${testEnv}. Must be either 'PSI' or 'OPENBIS'.`,
  );
}

export const BASE_URL = TestingEnv[testEnv as keyof typeof TestingEnv];

export const API_KEY = process.env.API_KEY || "";
