require('dotenv').config({ path: '.env.test' });

// Optionally mock database connection for tests when MOCK_DB env is set to 'true'
if (process.env.MOCK_DB === 'true') {
  jest.mock('../backend/src/config/database', () => ({
    query: jest.fn(),
    getConnection: jest.fn(),
    end: jest.fn()
  }));
}

// Global test utilities
global.testUtils = {
  createMockRequest: (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query
  }),

  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },

  createMockNext: () => jest.fn()
};
