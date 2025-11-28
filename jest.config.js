module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  modulePathIgnorePatterns: ['headless-server-build'],
};
