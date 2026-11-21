import '@jest/globals';

/**
 * Set test timeout to prevent long-running tests from hanging
 */
jest.setTimeout(30000);

/**
 * Global test setup - runs once before all tests
 */
beforeAll(() => {
  /**
   * Setup test environment variables
   */
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
});

/**
 * Setup before each individual test
 */
beforeEach(() => {
  /**
   * Clear all mocks and reset modules to ensure test isolation
   */
  jest.clearAllMocks();
  jest.resetModules();
});

/**
 * Global cleanup after all tests are complete
 */
afterAll(async () => {
  /**
   * Clean up the test environment - clear mocks and reset modules
   */
  jest.clearAllMocks();
  jest.resetModules();
}); 