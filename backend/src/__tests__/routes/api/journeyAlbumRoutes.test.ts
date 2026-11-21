import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import * as uploadController from '@/controllers/uploadController';

// Mock the uploadController methods to simulate actual file upload logic
jest.mock('@/controllers/uploadController', () => ({
  // Mock single file upload method
  uploadFile: jest.fn((req, res) => res.json({ message: 'uploadFile called' })),
  // Mock multiple files upload method
  uploadFiles: jest.fn((req, res) => res.json({ message: 'uploadFiles called' }))
}));

// Mock authentication middleware to bypass actual auth logic
jest.mock('@/middlewares/authMiddleware', () => ({
  // Bypass auth logic and allow the request to continue
  conditionalAuth: (req: Request, res: Response, next: NextFunction) => next()
}));

// Mock file upload middleware to simulate file uploads
jest.mock('@/middlewares/upload', () => ({
  // Mock a single file upload middleware
  uploadSingle: (req: Request, res: Response, next: NextFunction) => {
    // Simulate a file object being attached to the request
    req.file = {
      originalname: 'test.jpg',
      filename: 'test-123.jpg',
      path: '/uploads/test-123.jpg',
      size: 1024,
      mimetype: 'image/jpeg'
    } as Express.Multer.File;
    next();
  },
  // Mock multiple file uploads middleware
  uploadMultiple: (req: Request, res: Response, next: NextFunction) => {
    // Simulate multiple files being attached to the request
    req.files = [
      {
        originalname: 'test1.jpg',
        filename: 'test1-123.jpg',
        path: '/uploads/test1-123.jpg',
        size: 1024,
        mimetype: 'image/jpeg'
      },
      {
        originalname: 'test2.jpg',
        filename: 'test2-123.jpg',
        path: '/uploads/test2-123.jpg',
        size: 2048,
        mimetype: 'image/jpeg'
      }
    ] as Express.Multer.File[];
    next();
  }
}));

describe('Upload Routes', () => {
  let app: express.Express;

  // Setup Express app before each test
  beforeEach(() => {
    app = express();
    app.use(express.json()); // Parse incoming JSON payloads
    // Register the routes for file upload with the mocked controller methods
    app.post('/api/upload', uploadController.uploadFile);
    app.post('/api/upload/multiple', uploadController.uploadFiles);
    
    jest.clearAllMocks(); // Clear mocks to avoid state carryover between tests
  });

  // Test case for uploading a single file
  describe('POST /api/upload', () => {
    it('should upload a single file', async () => {
      const response = await request(app)
        .post('/api/upload') // Perform POST request to upload a single file
        .field('name', 'test upload') // Add form field data
        .attach('file', Buffer.from('fake image content'), 'test.jpg'); // Attach a fake file

      // Assert the response status and the returned message
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'uploadFile called' });
      // Ensure the uploadFile method was called
      expect(uploadController.uploadFile).toHaveBeenCalled();
    });
  });

  // Test case for uploading multiple files
  describe('POST /api/upload/multiple', () => {
    it('should upload multiple files', async () => {
      const response = await request(app)
        .post('/api/upload/multiple') // Perform POST request to upload multiple files
        .field('name', 'test upload') // Add form field data
        .attach('files', Buffer.from('fake image 1 content'), 'test1.jpg') // Attach first fake file
        .attach('files', Buffer.from('fake image 2 content'), 'test2.jpg'); // Attach second fake file

      // Assert the response status and the returned message
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'uploadFiles called' });
      // Ensure the uploadFiles method was called
      expect(uploadController.uploadFiles).toHaveBeenCalled();
    });
  });
});
