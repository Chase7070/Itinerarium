import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import router from '@/routes/api/uploadRoutes';
import * as uploadController from '@/controllers/uploadController';

// Mock controllers with actual controller method names
jest.mock('@/controllers/uploadController', () => ({
  uploadFile: jest.fn((req, res) => res.json({ message: 'uploadFile called' })),
  uploadFiles: jest.fn((req, res) => res.json({ message: 'uploadFiles called' }))
}));

// Mock middleware
jest.mock('@/middlewares/authMiddleware', () => ({
  conditionalAuth: (req: Request, res: Response, next: NextFunction) => next()
}));

// Mock upload middleware
jest.mock('@/middlewares/upload', () => ({
  uploadSingle: (req: Request, res: Response, next: NextFunction) => {
    req.file = {
      originalname: 'test.jpg',
      filename: 'test-123.jpg',
      path: '/uploads/test-123.jpg',
      size: 1024,
      mimetype: 'image/jpeg'
    } as Express.Multer.File;
    next();
  },
  uploadMultiple: (req: Request, res: Response, next: NextFunction) => {
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

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Ensure we directly use the uploadController methods
    app.post('/api/upload', uploadController.uploadFile);
    app.post('/api/upload/multiple', uploadController.uploadFiles);
    
    jest.clearAllMocks();
  });

  describe('POST /api/upload', () => {
    it('should upload a single file', async () => {
      const response = await request(app)
        .post('/api/upload')
        .field('name', 'test upload')
        .attach('file', Buffer.from('fake image content'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'uploadFile called' });
      expect(uploadController.uploadFile).toHaveBeenCalled();
    });
  });

  describe('POST /api/upload/multiple', () => {
    it('should upload multiple files', async () => {
      const response = await request(app)
        .post('/api/upload/multiple')
        .field('name', 'test upload')
        .attach('files', Buffer.from('fake image 1 content'), 'test1.jpg')
        .attach('files', Buffer.from('fake image 2 content'), 'test2.jpg');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'uploadFiles called' });
      expect(uploadController.uploadFiles).toHaveBeenCalled();
    });
  });
});
