import { Request, Response, NextFunction } from 'express';
import { checkWritePermission } from '@/middlewares/aclMiddleware';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

describe('ACL Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      locals: {}
    };
    nextFunction = jest.fn();
  });

  describe('checkWritePermission', () => {
    it('should call next if user has write permission', () => {
      // Arrange
      mockResponse.locals = {
        user_permission: 'write'
      };

      // Act
      checkWritePermission(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith();
      expect(nextFunction).not.toHaveBeenCalledWith(expect.any(ApiError));
    });

    it('should throw forbidden error if user does not have write permission', () => {
      // Arrange
      mockResponse.locals = {
        user_permission: 'read'
      };

      // Act
      checkWritePermission(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You do not have write permission to perform this action'
        })
      );
    });

    it('should handle general errors and pass them to next', () => {
      // Arrange
      mockResponse.locals = {}; // user_permission is undefined
      
      // Act
      checkWritePermission(mockRequest as Request, mockResponse as Response, nextFunction);
      
      // Assert
      expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}); 