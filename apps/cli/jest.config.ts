import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@modules(.*)$": "<rootDir>/src/modules$1",
    "^@lib(.*)$": "<rootDir>/src/lib$1",
    "^@constants(.*)$": "<rootDir>/src/constants$1",
  },
  reporters: ["default", "jest-junit"],
};
export default config;
