import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import router from '@/routes/api/shareRoutes';
import * as shareController from '@/controllers/shareController';

// Mock the controllers
jest.mock('@/controllers/shareController', () => ({
  updateShare: jest.fn((req, res) => res.json({ message: 'updateShare called' })),
  getShareByCode: jest.fn((req, res) => res.json({ message: 'getShareByCode called' }))
}));

// Mock middleware
jest.mock('@/middlewares/authMiddleware', () => ({
  authenticate: (req: Request, res: Response, next: NextFunction) => next()
}));

jest.mock('@/middlewares/shareMiddleware', () => ({
  validateMapSharing: (req: Request, res: Response, next: NextFunction) => next()
}));

describe('Share Routes', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Add mocked map_id parameter
    app.use('/api/maps/:map_id/share', (req, res, next) => {
      req.params.map_id = 'map-123';
      next();
    }, router);
    
    jest.clearAllMocks();
  });

  describe('PUT /api/maps/:map_id/share', () => {
    it('should update the map\'s sharing settings', async () => {
      const response = await request(app)
        .put('/api/maps/map-123/share')
        .send({
          range: 'private'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'updateShare called' });
      expect(shareController.updateShare).toHaveBeenCalled();
    });
  });
});

// Test the getShareByCode in the API root routes
describe('API Root Routes - Share', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Set up the /api/share/:code route
    app.get('/api/share/:code', shareController.getShareByCode);
    jest.clearAllMocks();
  });

  describe('GET /api/share/:code', () => {
    it('should retrieve sharing information by share code', async () => {
      const response = await request(app)
        .get('/api/share/ABC123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'getShareByCode called' });
      expect(shareController.getShareByCode).toHaveBeenCalled();
    });
  });
});
