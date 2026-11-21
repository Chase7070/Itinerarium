import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import * as userController from '@/controllers/userController';

// Mock controllers to simulate the actual controller methods
jest.mock('@/controllers/userController', () => ({
  register: jest.fn((req, res) => res.json({ message: 'register called' })),
  login: jest.fn((req, res) => res.json({ message: 'login called' })),
  getCurrentUser: jest.fn((req, res) => res.json({ message: 'getCurrentUser called' })),
  updateCurrentUser: jest.fn((req, res) => res.json({ message: 'updateCurrentUser called' })),
  getUserByEmail: jest.fn((req, res) => res.json({ message: 'getUserByEmail called' }))
}));

// Mock middleware to simulate authentication behavior
jest.mock('@/middlewares/authMiddleware', () => ({
  authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => next())
}));

// Import routes after mocking
import router from '@/routes/api/userRoutes';

describe('User Routes', () => {
  let app: express.Express;

  // Setup Express app before each test
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', router); // Register the user routes
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test for user registration
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200); // Expect HTTP status to be 200 (OK)
      expect(response.body).toEqual({ message: 'register called' }); // Expect the mock message from the controller
      expect(userController.register).toHaveBeenCalled(); // Verify that the register function was called
    });
  });

  // Test for user login
  describe('POST /api/users/login', () => {
    it('should log in the user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'login called' });
      expect(userController.login).toHaveBeenCalled();
    });
  });

  // Test for getting the current user information
  describe('GET /api/users/me', () => {
    it('should get current user information', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'getCurrentUser called' });
      expect(userController.getCurrentUser).toHaveBeenCalled();
    });
  });

  // Test for updating the current user profile
  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .send({
          username: 'updatedusername'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'updateCurrentUser called' });
      expect(userController.updateCurrentUser).toHaveBeenCalled();
    });
  });

  // Test for getting user information by email
  describe('GET /api/users/email/:email', () => {
    it('should get user information by email', async () => {
      const response = await request(app)
        .get('/api/users/email/test@example.com');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'getUserByEmail called' });
      expect(userController.getUserByEmail).toHaveBeenCalled();
    });
  });
});
