// test/journeyAlbumController.test.ts
import { Request, Response, NextFunction } from 'express';
import * as journeyAlbumController from '@/controllers/journeyAlbumController';
import * as journeyAlbumService from '@/services/journeyAlbumService';

// Mock the service layer
jest.mock('@/services/journeyAlbumService');

/**
 * Create a mock response object for testing
 */
function mockResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = { user: { id: 'mockUserId' } };
  return res;
}

// Mock next function for error handling
const mockNext: NextFunction = jest.fn();

// Simplified references for better readability
const controller = journeyAlbumController;
const service = journeyAlbumService;

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

describe('JourneyAlbumController with detailed logs', () => {
  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getJourneyAlbumById - success', async () => {
    // Arrange: Setup request and mock service response
    const req = { params: { id: 'album123' } } as unknown as Request;
    const expectedAlbum = { id: 'album123', name: 'Trip to Japan' };
    (service.getJourneyAlbumById as jest.Mock).mockResolvedValue(expectedAlbum);

    // Act: Call the controller method
    const res = mockResponse();
    await controller.getJourneyAlbumById(req, res, mockNext);
    const actual = (res.json as jest.Mock).mock.calls[0][0];

    // Log test details
    logTestDetails(
      'Get Journey Album Details (getJourneyAlbumById)',
      req.params,
      { journeyAlbum: expectedAlbum },
      actual
    );

    // Assert: Verify the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ journeyAlbum: expectedAlbum });
  });

  it('createJourneyAlbum - success', async () => {
    // Arrange: Setup request and mock service response
    const req = {
      params: { map_id: 'mapA', pin_id: 'pinB' },
      body: { name: 'New Album', images: [{ key: 'img001' }] },
    } as unknown as Request;
    const expectedCreated = { id: 'album456', name: 'New Album', images: [{ key: 'img001' }] };
    (service.createJourneyAlbum as jest.Mock).mockResolvedValue(expectedCreated);

    // Act: Call the controller method
    const res = mockResponse();
    await controller.createJourneyAlbum(req, res, mockNext);
    const actual = (res.json as jest.Mock).mock.calls[0][0];

    // Log test details
    logTestDetails(
      'Create Journey Album (createJourneyAlbum)',
      { params: req.params, body: req.body },
      { journeyAlbum: expectedCreated },
      actual
    );

    // Assert: Verify the service was called correctly and response is as expected
    expect(service.createJourneyAlbum).toHaveBeenCalledWith(
      'mapA',
      'pinB',
      'mockUserId',
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ journeyAlbum: expectedCreated });
  });

  it('updateJourneyAlbum - success', async () => {
    // Arrange: Setup request and mock service response
    const req = {
      params: { id: 'album789' },
      body: { name: 'Updated Album', images: [] },
    } as unknown as Request;
    const expectedUpdated = { id: 'album789', name: 'Updated Album', images: [] };
    (service.updateJourneyAlbum as jest.Mock).mockResolvedValue(expectedUpdated);

    // Act: Call the controller method
    const res = mockResponse();
    await controller.updateJourneyAlbum(req, res, mockNext);
    const actual = (res.json as jest.Mock).mock.calls[0][0];

    // Log test details
    logTestDetails(
      'Update Journey Album (updateJourneyAlbum)',
      { params: req.params, body: req.body },
      { journeyAlbum: expectedUpdated },
      actual
    );

    // Assert: Verify the service was called correctly and response is as expected
    expect(service.updateJourneyAlbum).toHaveBeenCalledWith('album789', req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ journeyAlbum: expectedUpdated });
  });

  it('deleteJourneyAlbum - success', async () => {
    // Arrange: Setup request and mock service response
    const req = { params: { id: 'toDeleteAlbum' } } as unknown as Request;
    (service.deleteJourneyAlbum as jest.Mock).mockResolvedValue(undefined);

    // Act: Call the controller method
    const res = mockResponse();
    await controller.deleteJourneyAlbum(req, res, mockNext);
    const actual = (res.json as jest.Mock).mock.calls[0][0];

    // Log test details
    logTestDetails(
      'Delete Journey Album (deleteJourneyAlbum)',
      req.params,
      { message: 'Journey album deleted successfully' },
      actual
    );

    // Assert: Verify the service was called correctly and response is as expected
    expect(service.deleteJourneyAlbum).toHaveBeenCalledWith('toDeleteAlbum', 'mockUserId');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Journey album deleted successfully' });
  });

  it('getAllJourneyAlbums - success', async () => {
    // Arrange: Setup request and mock service response
    const req = { params: { pin_id: 'pinList' } } as unknown as Request;
    const expectedList = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    (service.getAllJourneyAlbums as jest.Mock).mockResolvedValue(expectedList);

    // Act: Call the controller method
    const res = mockResponse();
    await controller.getAllJourneyAlbums(req, res, mockNext);
    const actual = (res.json as jest.Mock).mock.calls[0][0];

    // Log test details
    logTestDetails(
      'Get All Journey Albums For Pin (getAllJourneyAlbums)',
      req.params,
      { journeyAlbums: expectedList },
      actual
    );

    // Assert: Verify the service was called correctly and response is as expected
    expect(service.getAllJourneyAlbums).toHaveBeenCalledWith('pinList');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ journeyAlbums: expectedList });
  });
});
