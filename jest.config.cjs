module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.svg$": "jest-transform-stub",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./jest.setup.cjs"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!**/useStore.js",
    "!**/node_modules/**",
    "!**/App.jsx",
    "!**/main.jsx",
    "!**/config/**",
    "!src/pages/**",
  ],
};
