import { Request, Response, NextFunction } from 'express';
import { jest } from '@jest/globals';
import * as uploadController from '@/controllers/uploadController';
import { ApiError } from '@/types/api';
import { createMockRequest, createMockResponse, createMockNext, createMockFile } from '../helpers/mockObjects';

/**
 * Simplified reference for better readability
 */
const controller = uploadController;

/**
 * Log function to display test details with colored output
 */
function logTestDetails(title: string, input: any, expected: any, actual: any) {
  console.log(`\n🔍【Test Feature】: ${title}\n🟡 Current Input: ${JSON.stringify(input, null, 2)}\n🟢 Expected Output: ${JSON.stringify(expected, null, 2)}\n🔵 Actual Output: ${JSON.stringify(actual, null, 2)}\n  `);
}

describe('UploadController', () => {
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

  describe('uploadFile', () => {
    /**
     * Test successfully uploading a single file
     */
    it('should successfully upload a single file', async () => {
      const mockFile = createMockFile({
        originalname: 'test-image.jpg',
        filename: 'test-image-123.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/uploads/profile/test-image-123.jpg'
      });

      mockRequest.file = mockFile;
      mockRequest.query = { scene: 'profile' };

      await controller.uploadFile(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const expected = {
        file: {
          originalName: mockFile.originalname,
          filename: mockFile.filename,
          path: `/uploads/profile/${mockFile.filename}`,
          size: mockFile.size,
          mimetype: mockFile.mimetype
        }
      };
      
      logTestDetails(
        'Upload Single File (uploadFile)',
        { file: mockFile, query: mockRequest.query },
        expected,
        actual
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expected);
    });

    /**
     * Test handling missing file case
     */
    it('should handle missing file case', async () => {
      mockRequest.file = undefined;
      mockRequest.query = { scene: 'profile' };

      await controller.uploadFile(mockRequest as Request, mockResponse as Response, mockNext);
      
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Handle Missing File Case (uploadFile - no file)',
        { file: undefined, query: mockRequest.query },
        { error: 'No file uploaded' },
        { error: error instanceof ApiError ? error.message : 'Unknown error' }
      );

      expect(mockNext).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ApiError);
      expect((error as any).message).toBe('No file uploaded');
    });

    /**
     * Test using default scene when none is specified
     */
    it('should use default scene (others) when none specified', async () => {
      const mockFile = createMockFile({
        originalname: 'test-image.jpg',
        filename: 'test-image-123.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/uploads/others/test-image-123.jpg'
      });

      mockRequest.file = mockFile;
      mockRequest.query = {}; // No scene specified

      await controller.uploadFile(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const expected = {
        file: {
          originalName: mockFile.originalname,
          filename: mockFile.filename,
          path: `/uploads/others/${mockFile.filename}`,
          size: mockFile.size,
          mimetype: mockFile.mimetype
        }
      };
      
      logTestDetails(
        'Use Default Scene For File Upload (uploadFile - default scene)',
        { file: mockFile, query: mockRequest.query },
        expected,
        actual
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expected);
    });
  });

  describe('uploadFiles', () => {
    /**
     * Test successfully uploading multiple files
     */
    it('should successfully upload multiple files', () => {
      const mockFiles = [
        createMockFile({
          originalname: 'test-image-1.jpg',
          filename: 'test-image-1-123.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          path: '/uploads/journey/test-image-1-123.jpg'
        }),
        createMockFile({
          originalname: 'test-image-2.jpg',
          filename: 'test-image-2-123.jpg',
          mimetype: 'image/jpeg',
          size: 2048,
          path: '/uploads/journey/test-image-2-123.jpg'
        })
      ];

      mockRequest.files = mockFiles;
      mockRequest.query = { scene: 'journey' };

      controller.uploadFiles(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const expected = {
        files: mockFiles.map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          path: `/uploads/journey/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype
        }))
      };
      
      logTestDetails(
        'Upload Multiple Files (uploadFiles)',
        { files: mockFiles.length, query: mockRequest.query },
        expected,
        actual
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expected);
    });

    /**
     * Test handling missing files case
     */
    it('should handle missing files case', () => {
      mockRequest.files = undefined;
      mockRequest.query = { scene: 'journey' };

      controller.uploadFiles(mockRequest as Request, mockResponse as Response, mockNext);
      
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Handle Missing Files Case (uploadFiles - no files)',
        { files: undefined, query: mockRequest.query },
        { error: 'No files uploaded' },
        { error: error instanceof ApiError ? error.message : 'Unknown error' }
      );

      expect(mockNext).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ApiError);
      expect((error as any).message).toBe('No files uploaded');
    });

    /**
     * Test handling non-array files case
     */
    it('should handle non-array files case', () => {
      mockRequest.files = {} as Express.Multer.File[];
      mockRequest.query = { scene: 'journey' };

      controller.uploadFiles(mockRequest as Request, mockResponse as Response, mockNext);
      
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      
      logTestDetails(
        'Handle Non-Array Files Case (uploadFiles - invalid files format)',
        { files: 'object instead of array', query: mockRequest.query },
        { error: 'No files uploaded' },
        { error: error instanceof ApiError ? error.message : 'Unknown error' }
      );

      expect(mockNext).toHaveBeenCalled();
      expect(error).toBeInstanceOf(ApiError);
      expect((error as any).message).toBe('No files uploaded');
    });

    /**
     * Test using default scene when none is specified for multiple files
     */
    it('should use default scene for multiple files upload when none specified', () => {
      const mockFiles = [
        createMockFile({
          originalname: 'test-image-1.jpg',
          filename: 'test-image-1-123.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          path: '/uploads/others/test-image-1-123.jpg'
        }),
        createMockFile({
          originalname: 'test-image-2.jpg',
          filename: 'test-image-2-123.jpg',
          mimetype: 'image/jpeg',
          size: 2048,
          path: '/uploads/others/test-image-2-123.jpg'
        })
      ];

      mockRequest.files = mockFiles;
      mockRequest.query = {}; // No scene specified

      controller.uploadFiles(mockRequest as Request, mockResponse as Response, mockNext);
      
      const actual = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const expected = {
        files: mockFiles.map(file => ({
          originalName: file.originalname,
          filename: file.filename,
          path: `/uploads/others/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype
        }))
      };
      
      logTestDetails(
        'Use Default Scene For Multiple Files Upload (uploadFiles - default scene)',
        { files: mockFiles.length, query: mockRequest.query },
        expected,
        actual
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expected);
    });
  });
}); 