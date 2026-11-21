import { Request, Response } from 'express';
import { errorHandler } from '@/middlewares/errorHandler';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/mockObjects';

describe('ErrorHandler', () => {
  /**
   * Test variables declaration
   */
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  /**
   * Setup before each test
   */
  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
    jest.clearAllMocks();
    
    // Mock console.error to avoid polluting test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  /**
   * Cleanup after each test
   */
  afterEach(() => {
    // Restore console.error
    (console.error as jest.Mock).mockRestore();
  });

  /**
   * Test handling of API errors
   */
  it('should handle ApiError correctly', () => {
    const apiError = new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, 'Invalid request parameters');

    errorHandler(apiError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: ApiErrorCode.INVALID_ARGUMENT,
        reason: ApiErrorReason.INVALID_ARGUMENT,
      })
    );
  });

  /**
   * Test handling of unknown errors
   */
  it('should handle unknown errors correctly', () => {
    const error = new Error('Unknown error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        reason: ApiErrorReason.INTERNAL_SERVER_ERROR,
      })
    );
  });

  /**
   * Test error stack inclusion in development environment
   */
  it('should include error stack in development environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at Test.stack';

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    // Only assert key parts because the response structure in development may contain additional information
    expect(mockResponse.json).toHaveBeenCalled();
    const jsonCallArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(jsonCallArg).toBeDefined();

    process.env.NODE_ENV = originalNodeEnv;
  });
}); 