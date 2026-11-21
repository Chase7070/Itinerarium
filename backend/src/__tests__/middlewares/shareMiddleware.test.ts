import { Request, Response, NextFunction } from 'express';
import { validateMapSharing } from '@/middlewares/shareMiddleware';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import Map from '@/models/map';

// Mock Map model
jest.mock('@/models/map', () => ({
  findById: jest.fn()
}));

describe('Share Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {}
    };
    mockResponse = {
      locals: {
        user: { id: 'user-123' }
      }
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('validateMapSharing', () => {
    it('should call next when map exists and user is owner', async () => {
      // Arrange
      mockRequest.params = { map_id: 'map-123' };
      const mockMap = {
        _id: 'map-123',
        owner: {
          toString: () => 'user-123'
        },
        type: 'custom'
      };
      (Map.findById as jest.Mock).mockResolvedValue(mockMap);

      // Act
      await validateMapSharing(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(Map.findById).toHaveBeenCalledWith('map-123');
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should throw error when map_id is missing', async () => {
      // Arrange
      mockRequest.params = {}; // No map_id

      // Act
      await validateMapSharing(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Map ID is required'
        })
      );
    });

    it('should throw error when map not found', async () => {
      // Arrange
      mockRequest.params = { map_id: 'map-123' };
      (Map.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await validateMapSharing(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Map not found'
        })
      );
    });

    it('should throw error when user is not the map owner', async () => {
      // Arrange
      mockRequest.params = { map_id: 'map-123' };
      const mockMap = {
        _id: 'map-123',
        owner: {
          toString: () => 'different-user'
        },
        type: 'custom'
      };
      (Map.findById as jest.Mock).mockResolvedValue(mockMap);

      // Act
      await validateMapSharing(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Only the map owner can perform this action'
        })
      );
    });

    it('should throw error when map type is default', async () => {
      // Arrange
      mockRequest.params = { map_id: 'map-123' };
      const mockMap = {
        _id: 'map-123',
        owner: {
          toString: () => 'user-123'
        },
        type: 'default'
      };
      (Map.findById as jest.Mock).mockResolvedValue(mockMap);

      // Act
      await validateMapSharing(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Default maps cannot be shared'
        })
      );
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      mockRequest.params = { map_id: 'map-123' };
      const mockError = new Error('Database error');
      (Map.findById as jest.Mock).mockRejectedValue(mockError);

      // Act
      await validateMapSharing(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalledWith(mockError);
    });
  });
}); 