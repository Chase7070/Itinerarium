import { Request, Response } from 'express';
import * as mapController from '@/controllers/mapController';
import * as mapService from '@/services/mapService';
import { createMockRequest, createMockResponse, createMockNext, mockMapData } from '../helpers/mockObjects';

/**
 * Extend the Express Request interface to include user property
 */
declare module 'express' {
    interface Request {
        user?: {
            id: string;
            email: string;
        };
    }
}

// Mock dependencies for isolated testing
jest.mock('@/services/mapService');

// Simplified references for better readability
const controller = mapController;
const service = mapService;

/**
 * Log function to display test details
 */
function logTestDetails(title: string, input: any, expected: any, actual: any) {
  console.log(`
🔍【Test Feature】: ${title}
🟡 Current Input: ${JSON.stringify(input, null, 2)}
🟢 Expected Output: ${JSON.stringify(expected, null, 2)}
🔵 Actual Output: ${JSON.stringify(actual, null, 2)}
  `);
}

describe('MapController', () => {
    // Test variables declaration
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response> & { locals: { user: { id: string; email: string } } };
    let mockNext: jest.Mock;

    // Setup before each test
    beforeEach(() => {
        mockReq = createMockRequest();
        mockRes = createMockResponse() as typeof mockRes;
        mockNext = createMockNext();
        jest.clearAllMocks();
    });

    describe('createMap', () => {
        it('should create a map successfully', async () => {
            // Prepare test data
            mockReq.body = {
                name: 'Test Map',
                description: 'This is a test map'
            };
            (service.createMap as jest.Mock).mockResolvedValue(mockMapData);

            // Execute test
            await controller.createMap(mockReq as Request, mockRes as Response, mockNext);

            const actual = (mockRes.json as jest.Mock).mock.calls[0][0];
            
            // Log test details
            logTestDetails(
              'Create Map (createMap)',
              mockReq.body,
              { map: mockMapData },
              actual
            );

            // Verify results
            expect(service.createMap).toHaveBeenCalledWith(
                mockRes.locals.user.id,
                mockReq.body
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ map: mockMapData });
        });

        it('should handle validation error', async () => {
            // Prepare test data
            mockReq.body = {};
            const error = new Error('Validation error');
            (service.createMap as jest.Mock).mockRejectedValue(error);

            // Execute test
            await controller.createMap(mockReq as Request, mockRes as Response, mockNext);
            
            // Log test details
            logTestDetails(
              'Handle map creation validation error (createMap - validation error)',
              mockReq.body,
              { error: 'Validation error' },
              { error: error.message }
            );

            // Verify results
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getUserMaps', () => {
        it('should get user maps successfully', async () => {
            // Prepare test data
            const mockMaps = [mockMapData];
            (service.getUserMaps as jest.Mock).mockResolvedValue(mockMaps);

            // Execute test
            await controller.getUserMaps(mockReq as Request, mockRes as Response, mockNext);

            const actual = (mockRes.json as jest.Mock).mock.calls[0][0];
            
            // Log test details
            logTestDetails(
              'Get User Maps List (getUserMaps)',
              { userId: mockRes.locals.user.id },
              { maps: mockMaps },
              actual
            );

            // Verify results
            expect(service.getUserMaps).toHaveBeenCalledWith(mockRes.locals.user.id);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ maps: mockMaps });
        });

        it('should handle error when getting maps fails', async () => {
            // Prepare test data
            const error = new Error('Failed to get maps');
            (service.getUserMaps as jest.Mock).mockRejectedValue(error);

            // Execute test
            await controller.getUserMaps(mockReq as Request, mockRes as Response, mockNext);
            
            // Log test details
            logTestDetails(
              'Handle error when getting maps fails (getUserMaps - error)',
              { userId: mockRes.locals.user.id },
              { error: 'Failed to get maps' },
              { error: error.message }
            );

            // Verify results
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('updateMap', () => {
        it('should update map successfully', async () => {
            // Prepare test data
            mockReq.params = { id: mockMapData._id.toString() };
            mockReq.body = {
                name: 'Updated Map',
                description: 'This is an updated map'
            };
            (service.updateMap as jest.Mock).mockResolvedValue(mockMapData);

            // Execute test
            await controller.updateMap(mockReq as Request, mockRes as Response, mockNext);

            const actual = (mockRes.json as jest.Mock).mock.calls[0][0];
            
            // Log test details
            logTestDetails(
              'Update Map Information (updateMap)',
              { params: mockReq.params, body: mockReq.body },
              { map: mockMapData },
              actual
            );

            // Verify results
            expect(service.updateMap).toHaveBeenCalledWith(
                mockRes.locals.user.id,
                mockReq.params.id,
                mockReq.body
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ map: mockMapData });
        });

        it('should handle error when updating map fails', async () => {
            // Prepare test data
            mockReq.params = { id: mockMapData._id.toString() };
            const error = new Error('Failed to update map');
            (service.updateMap as jest.Mock).mockRejectedValue(error);

            // Execute test
            await controller.updateMap(mockReq as Request, mockRes as Response, mockNext);
            
            // Log test details
            logTestDetails(
              'Handle error when updating map fails (updateMap - error)',
              { params: mockReq.params, body: mockReq.body },
              { error: 'Failed to update map' },
              { error: error.message }
            );

            // Verify results
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteMap', () => {
        it('should delete map successfully', async () => {
            // Prepare test data
            mockReq.params = { id: mockMapData._id.toString() };
            (service.deleteMap as jest.Mock).mockResolvedValue(undefined);

            // Execute test
            await controller.deleteMap(mockReq as Request, mockRes as Response, mockNext);

            const actual = (mockRes.json as jest.Mock).mock.calls[0][0];
            
            // Log test details
            logTestDetails(
              'Delete Map (deleteMap)',
              mockReq.params,
              { message: 'Map deleted successfully' },
              actual
            );

            // Verify results
            expect(service.deleteMap).toHaveBeenCalledWith(
                mockRes.locals.user.id,
                mockReq.params.id
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Map deleted successfully' });
        });

        it('should handle error when deleting map fails', async () => {
            // Prepare test data
            mockReq.params = { id: mockMapData._id.toString() };
            const error = new Error('Failed to delete map');
            (service.deleteMap as jest.Mock).mockRejectedValue(error);

            // Execute test
            await controller.deleteMap(mockReq as Request, mockRes as Response, mockNext);
            
            // Log test details
            logTestDetails(
              'Handle error when deleting map fails (deleteMap - error)',
              mockReq.params,
              { error: 'Failed to delete map' },
              { error: error.message }
            );

            // Verify results
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
}); 