import { Request, Response, NextFunction } from 'express';
import * as mapPinController from '@/controllers/mapPinController';
import * as mapPinService from '@/services/mapPinService';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import { createMockRequest, createMockResponse, createMockNext, mockMapPinData } from '../helpers/mockObjects';

/**
 * Mock dependencies to isolate controller logic testing
 */
jest.mock('@/services/mapPinService');

/**
 * Simplified references for better readability
 */
const controller = mapPinController;
const service = mapPinService;

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

describe('MapPinController', () => {
  /**
   * Common test variables
   */
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

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

  describe('createMapPin', () => {
    /**
     * Test successful map pin creation
     */
    it('should successfully create a new map pin', async () => {
      const mockPin = {
        _id: 'test-pin-id',
        mapId: 'test-map-id',
        geo_location: {
          type: 'Point',
          coordinates: [139.6503, 35.6762] // [longitude, latitude]
        },
        country: 'Japan',
        city: 'Tokyo'
      };

      mockRequest.body = {
        geo_location: {
          lat: 35.6762,
          lng: 139.6503
        },
        country: 'Japan',
        city: 'Tokyo'
      };
      mockRequest.params = { map_id: 'test-map-id' };

      (service.createMapPin as jest.Mock).mockResolvedValue(mockPin);

      await controller.createMapPin(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Create Map Pin (createMapPin)',
        { params: mockRequest.params, body: mockRequest.body },
        { mapPin: mockPin },
        actual
      );

      expect(service.createMapPin).toHaveBeenCalledWith(
        mockRequest.params.map_id,
        mockResponse.locals!.user.id,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ mapPin: mockPin });
    });

    /**
     * Test invalid input validation
     */
    it('should handle invalid input data', async () => {
      mockRequest.body = {
        country: 'Japan',
        city: 'Tokyo'
      };
      mockRequest.params = { map_id: 'test-map-id' };

      await controller.createMapPin(mockRequest as Request, mockResponse as Response, mockNext);
      
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Handle invalid input for map pin creation (createMapPin - invalid input)',
        { params: mockRequest.params, body: mockRequest.body },
        { error: 'Expected to fail due to missing geo_location' },
        { error: error instanceof ApiError ? error.message : 'Unknown error' }
      );

      expect(mockNext).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ApiError);
    });
  });

  describe('getMapPinsByMapId', () => {
    /**
     * Test successful retrieval of all pins for a map
     */
    it('should successfully get all pins for a map', async () => {
      const mockPins = [
        {
          _id: 'pin-1',
          geo_location: {
            type: 'Point',
            coordinates: [139.6503, 35.6762]
          },
          country: 'Japan',
          city: 'Tokyo'
        },
        {
          _id: 'pin-2',
          geo_location: {
            type: 'Point',
            coordinates: [151.2093, -33.8688]
          },
          country: 'Australia',
          city: 'Sydney'
        }
      ];

      mockRequest.params = { map_id: 'test-map-id' };

      (service.getMapPinsByMapId as jest.Mock).mockResolvedValue(mockPins);

      await controller.getMapPinsByMapId(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Get All Pins For A Map (getMapPinsByMapId)',
        mockRequest.params,
        { mapPins: mockPins },
        actual
      );

      expect(service.getMapPinsByMapId).toHaveBeenCalledWith(mockRequest.params.map_id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ mapPins: mockPins });
    });

    /**
     * Test handling non-existent map
     */
    it('should handle case when map does not exist', async () => {
      mockRequest.params = { map_id: 'non-existent-map' };

      const error = new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map not found');
      (service.getMapPinsByMapId as jest.Mock).mockRejectedValue(error);

      await controller.getMapPinsByMapId(mockRequest as Request, mockResponse as Response, mockNext);
      
      logTestDetails(
        'Handle non-existent map when getting pins (getMapPinsByMapId - map not found)',
        mockRequest.params,
        { error: 'Map not found' },
        { error: error.message }
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateMapPin', () => {
    /**
     * Test successful map pin update
     */
    it('should successfully update a map pin', async () => {
      const mockUpdatedPin = {
        _id: 'test-pin-id',
        geo_location: {
          type: 'Point',
          coordinates: [139.7703, 35.6762]
        },
        country: 'Japan',
        city: 'Tokyo'
      };

      mockRequest.params = { id: 'test-pin-id' };
      mockRequest.body = {
        geo_location: {
          lat: 35.6762,
          lng: 139.7703
        },
        country: 'Japan',
        city: 'Tokyo'
      };

      (service.updateMapPin as jest.Mock).mockResolvedValue(mockUpdatedPin);

      await controller.updateMapPin(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Update Map Pin (updateMapPin)',
        { params: mockRequest.params, body: mockRequest.body },
        { mapPin: mockUpdatedPin },
        actual
      );

      expect(service.updateMapPin).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ mapPin: mockUpdatedPin });
    });
  });

  describe('deleteMapPin', () => {
    /**
     * Test successful map pin deletion
     */
    it('should successfully delete a map pin', async () => {
      mockRequest.params = { id: 'test-pin-id' };

      (service.deleteMapPin as jest.Mock).mockResolvedValue(true);

      await controller.deleteMapPin(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Delete Map Pin (deleteMapPin)',
        mockRequest.params,
        {},
        actual
      );

      expect(service.deleteMapPin).toHaveBeenCalledWith(
        mockRequest.params.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });

  describe('getUserMapPins', () => {
    /**
     * Test getting all pins for a user
     */
    it('should get all pins for a user', async () => {
      const mockUserPins = [
        {
          _id: 'pin-1',
          mapId: 'map-1',
          geo_location: {
            type: 'Point',
            coordinates: [139.6503, 35.6762]
          },
          country: 'Japan',
          city: 'Tokyo'
        }
      ];

      (service.getUserMapPins as jest.Mock).mockResolvedValue(mockUserPins);

      await controller.getUserMapPins(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Get User Map Pins (getUserMapPins)',
        { userId: mockResponse.locals!.user.id },
        { mapPins: mockUserPins },
        actual
      );

      expect(service.getUserMapPins).toHaveBeenCalledWith(mockResponse.locals!.user.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ mapPins: mockUserPins });
    });
  });
}); 