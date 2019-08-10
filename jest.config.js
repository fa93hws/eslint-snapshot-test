module.exports = {
  roots: [
    "<rootDir>"
  ],
  transform: {
    ".ts$": "ts-jest"
  },
  testMatch: [
    "**/tests/**/*.tests.ts"
  ],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
  ],
  coverageReporters: [
    'text',
  ]
}
