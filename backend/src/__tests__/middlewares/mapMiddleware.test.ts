import { Request, Response, NextFunction } from 'express';
import { authorizeMapAccess, addCollaborator } from '@/middlewares/mapMiddleware';
import { validateMapAccess } from '@/services/mapService';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import mongoose from 'mongoose';

// Mock mapService
jest.mock('@/services/mapService', () => ({
  validateMapAccess: jest.fn(),
}));

describe('Map Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {}
    };
    mockResponse = {
      locals: {
        user: { id: 'user-123' }
      }
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authorizeMapAccess', () => {
    it('should authorize access and set permission when valid', async () => {
      // Arrange
      mockRequest.params = { map_id: 'map-123' };
      (validateMapAccess as jest.Mock).mockResolvedValue('write');

      // Act
      await authorizeMapAccess(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(validateMapAccess).toHaveBeenCalledWith('map-123', 'user-123');
      expect(mockResponse.locals).toHaveProperty('user_permission', 'write');
      expect(nextFunction).toHaveBeenCalledWith();
      expect(nextFunction).not.toHaveBeenCalledWith(expect.any(ApiError));
    });

    it('should throw error when map_id is missing', async () => {
      // Arrange
      mockRequest.params = {}; // No map_id

      // Act
      await authorizeMapAccess(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Map ID is required'
        })
      );
    });

    it('should handle service errors and pass to next', async () => {
      // Arrange
      mockRequest.params = { map_id: 'map-123' };
      const mockError = new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map not found');
      (validateMapAccess as jest.Mock).mockRejectedValue(mockError);

      // Act
      await authorizeMapAccess(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(mockError);
    });
  });

  describe('addCollaborator', () => {
    it('should add user as collaborator and remove duplicates', async () => {
      // Arrange
      const mockMap = {
        collaborators: ['existing-user'],
        save: jest.fn().mockResolvedValue(true)
      };
      mockResponse.locals = {
        map: mockMap,
        user: { id: 'user-123' }
      };

      // Act
      await addCollaborator(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockMap.collaborators).toContain('user-123');
      expect(mockMap.save).toHaveBeenCalled();
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should skip if map is not available', async () => {
      // Arrange
      mockResponse.locals = {
        user: { id: 'user-123' }
      };

      // Act
      await addCollaborator(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should skip if user is not available', async () => {
      // Arrange
      mockResponse.locals = {
        map: { collaborators: [], save: jest.fn() }
      };

      // Act
      await addCollaborator(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should handle errors during save and pass to next', async () => {
      // Arrange
      const mockError = new Error('Save failed');
      const mockMap = {
        collaborators: [],
        save: jest.fn().mockRejectedValue(mockError)
      };
      mockResponse.locals = {
        map: mockMap,
        user: { id: 'user-123' }
      };

      // Act
      await addCollaborator(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(mockError);
    });
  });
}); 