module.exports = {
  verbose: true,
  transform: {
    '^.+\\.js$': '<rootDir>/scripts/jest/jest.transform.js',
    "^.+\\.svg$": "jest-svg-transformer"
  },
  setupFilesAfterEnv: [
    '<rootDir>/scripts/jest/setup.js',
  ],
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}",
    "!**/node_modules/**"
  ]
};
