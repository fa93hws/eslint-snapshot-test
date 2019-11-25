module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.tests.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!src/index.ts'],
  coverageDirectory: 'coverage',
};
