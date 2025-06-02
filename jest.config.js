module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  testMatch: ["<rootDir>/test/**/*.test.js"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Thêm dòng này để xử lý JS/JSX
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)",
  ],
};