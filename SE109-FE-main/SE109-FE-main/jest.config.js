module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  testMatch: ["<rootDir>/test/**/*.test.js"],
  moduleDirectories: ["node_modules", "src"],

  // 👇 Thêm dòng này để transform axios (hoặc toàn bộ node_modules trừ một số thư viện nhất định)
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)", // chỉ transpile axios
  ],
};
