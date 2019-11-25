module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.tests.ts'],
  collectCoverageFrom: ['**/*.ts', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
};
