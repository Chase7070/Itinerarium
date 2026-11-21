import { Request, Response, NextFunction } from 'express';
import * as shareController from '@/controllers/shareController';
import * as shareService from '@/services/shareService';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import { createMockRequest, createMockResponse, createMockNext, mockShareData } from '../helpers/mockObjects';

/**
 * Mock service dependencies to isolate controller testing
 */
jest.mock('@/services/shareService');

/**
 * Simplified references for better readability
 */
const controller = shareController;
const service = shareService;

/**
 * Log function to display test details with colored output
 */
function logTestDetails(title: string, input: any, expected: any, actual: any) {
  console.log(`
🔍【Test Feature】: ${title}
🟡 Current Input: ${JSON.stringify(input, null, 2)}
🟢 Expected Output: ${JSON.stringify(expected, null, 2)}
🔵 Actual Output: ${JSON.stringify(actual, null, 2)}
  `);
}

describe('ShareController', () => {
  /**
   * Common test variables
   */
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  /**
   * Setup before each test to ensure clean state
   */
  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
    if (!mockResponse.locals) {
      mockResponse.locals = { user: { id: 'test-user-id', email: 'test@example.com' } };
    }
    jest.clearAllMocks();
  });

  describe('updateShare', () => {
    /**
     * Test updating map share settings to private mode
     */
    it('should successfully update map share settings - private', async () => {
      const mockShare = {
        _id: 'test-share-id',
        mapId: 'test-map-id',
        range: 'private',
        relevant_ids: []
      };

      mockRequest.params = { map_id: 'test-map-id' };
      mockRequest.body = {
        range: 'private'
      };

      (service.updateShare as jest.Mock).mockResolvedValue(mockShare);

      await controller.updateShare(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];

      logTestDetails(
        'Update Map Share Settings - Private Mode (updateShare - private)',
        { params: mockRequest.params, body: mockRequest.body },
        { share: mockShare },
        actual
      );

      expect(service.updateShare).toHaveBeenCalledWith(
        mockRequest.params.map_id,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ share: mockShare });
    });

    /**
     * Test updating map share settings to assigned users mode
     */
    it('should successfully update map share settings - assigned', async () => {
      const mockShare = {
        _id: 'test-share-id',
        mapId: 'test-map-id',
        range: 'assigned',
        relevant_ids: [
          { id: 'user1', permission: 'read' },
          { id: 'user2', permission: 'write' }
        ]
      };

      mockRequest.params = { map_id: 'test-map-id' };
      mockRequest.body = {
        range: 'assigned',
        relevant_ids: [
          { id: 'user1', permission: 'read' },
          { id: 'user2', permission: 'write' }
        ]
      };

      (service.updateShare as jest.Mock).mockResolvedValue(mockShare);

      await controller.updateShare(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];

      logTestDetails(
        'Update Map Share Settings - Assigned Users (updateShare - assigned)',
        { params: mockRequest.params, body: mockRequest.body },
        { share: mockShare },
        actual
      );

      expect(service.updateShare).toHaveBeenCalledWith(
        mockRequest.params.map_id,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ share: mockShare });
    });

    /**
     * Test handling invalid sharing range
     */
    it('should handle invalid sharing range', async () => {
      mockRequest.params = { map_id: 'test-map-id' };
      mockRequest.body = {
        range: 'invalid_range'
      };

      await controller.updateShare(mockRequest as Request, mockResponse as Response, mockNext);

      const error = mockNext.mock.calls[0][0];
      
      logTestDetails(
        'Handle Invalid Sharing Range (updateShare - invalid range)',
        { params: mockRequest.params, body: mockRequest.body },
        { error: 'Expected to pass error to next middleware' },
        { error: error instanceof ApiError ? error.message : 'Unknown error' }
      );

      expect(mockNext).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ApiError);
    });

    /**
     * Test handling invalid permission type
     */
    it('should handle invalid permission type', async () => {
      mockRequest.params = { map_id: 'test-map-id' };
      mockRequest.body = {
        range: 'assigned',
        relevant_ids: [
          { id: 'user1', permission: 'invalid_permission' }
        ]
      };

      await controller.updateShare(mockRequest as Request, mockResponse as Response, mockNext);

      const error = mockNext.mock.calls[0][0];
      
      logTestDetails(
        'Handle Invalid Permission Type (updateShare - invalid permission)',
        { params: mockRequest.params, body: mockRequest.body },
        { error: 'Expected to pass error to next middleware' },
        { error: error instanceof ApiError ? error.message : 'Unknown error' }
      );

      expect(mockNext).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ApiError);
    });
  });

  describe('getShareByCode', () => {
    /**
     * Test successfully retrieving share information by code
     */
    it('should successfully get share information by code', async () => {
      const mockShareInfo = {
        share: {
          _id: 'test-share-id',
          mapId: 'test-map-id',
          range: 'assigned',
          relevant_ids: [
            { id: 'user1', permission: 'read' }
          ]
        },
        permission: 'read'
      };

      mockRequest.params = { code: 'ABC123' };

      (service.getShareByCode as jest.Mock).mockResolvedValue(mockShareInfo);

      await controller.getShareByCode(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];

      logTestDetails(
        'Get Share Information By Code (getShareByCode)',
        mockRequest.params,
        mockShareInfo,
        actual
      );

      expect(service.getShareByCode).toHaveBeenCalledWith(
        mockRequest.params.code,
        mockResponse.locals!.user
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockShareInfo);
    });

    /**
     * Test handling empty share code
     */
    it('should handle empty share code', async () => {
      mockRequest.params = { code: '' };

      await controller.getShareByCode(mockRequest as Request, mockResponse as Response, mockNext);

      const error = mockNext.mock.calls[0][0];
      
      logTestDetails(
        'Handle Empty Share Code (getShareByCode - empty code)',
        mockRequest.params,
        { error: 'Expected to pass error to next middleware' },
        { error: error instanceof ApiError ? error.message : 'Unknown error' }
      );

      expect(mockNext).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe('Share code is required');
    });

    /**
     * Test handling share not found
     */
    it('should handle share not found', async () => {
      mockRequest.params = { code: 'INVALID_CODE' };

      const error = new ApiError(
        ApiErrorCode.NOT_FOUND,
        ApiErrorReason.RESOURCE_NOT_FOUND,
        'Share not found'
      );
      
      (service.getShareByCode as jest.Mock).mockRejectedValue(error);

      await controller.getShareByCode(mockRequest as Request, mockResponse as Response, mockNext);
      
      logTestDetails(
        'Handle Share Not Found (getShareByCode - not found)',
        mockRequest.params,
        { error: 'Share not found' },
        { error: error.message }
      );

      expect(service.getShareByCode).toHaveBeenCalledWith(
        mockRequest.params.code,
        mockResponse.locals!.user
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
}); 