/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/test"
  ],
  transform: {
    "^.+\\.test.(ts|tsx|mts)$": "ts-jest"
  },
};