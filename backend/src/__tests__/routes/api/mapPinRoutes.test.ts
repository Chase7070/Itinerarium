import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import router from '@/routes/api/mapPinRoutes';
import * as mapPinController from '@/controllers/mapPinController';

// Mock the controllers
jest.mock('@/controllers/mapPinController', () => ({
  createMapPin: jest.fn((req, res) => res.json({ message: 'createMapPin called' })),
  getMapPinsByMapId: jest.fn((req, res) => res.json({ message: 'getMapPinsByMapId called' })),
  updateMapPin: jest.fn((req, res) => res.json({ message: 'updateMapPin called' })),
  deleteMapPin: jest.fn((req, res) => res.json({ message: 'deleteMapPin called' }))
}));

// Mock middleware
jest.mock('@/middlewares/authMiddleware', () => ({
  authenticate: (req: Request, res: Response, next: NextFunction) => next()
}));

jest.mock('@/middlewares/mapMiddleware', () => ({
  authorizeMapAccess: (req: Request, res: Response, next: NextFunction) => {
    res.locals.user_permission = 'write';
    next();
  },
  addCollaborator: (req: Request, res: Response, next: NextFunction) => next()
}));

jest.mock('@/middlewares/aclMiddleware', () => ({
  checkWritePermission: (req: Request, res: Response, next: NextFunction) => next()
}));

describe('Map Pin Routes', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Mock map_id parameter
    app.use('/api/maps/:map_id/pins', (req, res, next) => {
      req.params.map_id = 'map-123';
      next();
    }, router);
    jest.clearAllMocks();
  });

  describe('POST /api/maps/:map_id/pins', () => {
    it('should create a new map pin', async () => {
      const response = await request(app)
        .post('/api/maps/map-123/pins')
        .send({
          geo_location: { lat: 35.6762, lng: 139.6503 },
          country: 'Japan',
          city: 'Tokyo'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'createMapPin called' });
      expect(mapPinController.createMapPin).toHaveBeenCalled();
    });
  });

  describe('GET /api/maps/:map_id/pins', () => {
    it('should retrieve all pins for the specific map', async () => {
      const response = await request(app)
        .get('/api/maps/map-123/pins');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'getMapPinsByMapId called' });
      expect(mapPinController.getMapPinsByMapId).toHaveBeenCalled();
    });
  });

  describe('PUT /api/maps/:map_id/pins/:id', () => {
    it('should update map pin information', async () => {
      const response = await request(app)
        .put('/api/maps/map-123/pins/pin-123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'updateMapPin called' });
      expect(mapPinController.updateMapPin).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/maps/:map_id/pins/:id', () => {
    it('should delete a map pin', async () => {
      const response = await request(app)
        .delete('/api/maps/map-123/pins/pin-123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'deleteMapPin called' });
      expect(mapPinController.deleteMapPin).toHaveBeenCalled();
    });
  });
});
