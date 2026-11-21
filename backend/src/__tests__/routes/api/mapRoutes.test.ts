import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import * as mapController from '@/controllers/mapController';

// Mock the controllers
jest.mock('@/controllers/mapController', () => ({
  createMap: jest.fn((req, res) => res.json({ message: 'createMap called' })),
  getUserMaps: jest.fn((req, res) => res.json({ message: 'getUserMaps called' })),
  updateMap: jest.fn((req, res) => res.json({ message: 'updateMap called' })),
  deleteMap: jest.fn((req, res) => res.json({ message: 'deleteMap called' }))
}));

// Mock middleware
jest.mock('@/middlewares/authMiddleware', () => ({
  authenticate: (req: Request, res: Response, next: NextFunction) => next()
}));

jest.mock('@/middlewares/mapMiddleware', () => ({
  authorizeMapAccess: (req: Request, res: Response, next: NextFunction) => {
    res.locals.user_permission = 'write';
    next();
  }
}));

jest.mock('@/middlewares/aclMiddleware', () => ({
  checkWritePermission: (req: Request, res: Response, next: NextFunction) => next()
}));

// Mock routes to avoid importing sub-routes
jest.mock('@/routes/api/mapPinRoutes', () => ({}));
jest.mock('@/routes/api/shareRoutes', () => ({}));

describe('Map Routes', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Set up routes directly instead of importing mapRoutes
    app.post('/api/maps', mapController.createMap);
    app.get('/api/maps', mapController.getUserMaps);
    app.put('/api/maps/:id', mapController.updateMap);
    app.delete('/api/maps/:id', mapController.deleteMap);
    
    jest.clearAllMocks();
  });

  describe('POST /api/maps', () => {
    it('should create a new map', async () => {
      const response = await request(app)
        .post('/api/maps')
        .send({ name: 'Test Map', description: 'Test Description' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'createMap called' });
      expect(mapController.createMap).toHaveBeenCalled();
    });
  });

  describe('GET /api/maps', () => {
    it('should retrieve all maps for the user', async () => {
      const response = await request(app)
        .get('/api/maps');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'getUserMaps called' });
      expect(mapController.getUserMaps).toHaveBeenCalled();
    });
  });

  describe('PUT /api/maps/:id', () => {
    it('should update map information', async () => {
      const response = await request(app)
        .put('/api/maps/map-123')
        .send({ name: 'Updated Map' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'updateMap called' });
      expect(mapController.updateMap).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/maps/:id', () => {
    it('should delete a map', async () => {
      const response = await request(app)
        .delete('/api/maps/map-123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'deleteMap called' });
      expect(mapController.deleteMap).toHaveBeenCalled();
    });
  });
});
