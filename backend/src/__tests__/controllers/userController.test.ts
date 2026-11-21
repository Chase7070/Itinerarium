import { Request, Response } from 'express';
import { createMockRequest, createMockResponse, createMockNext, mockUserData } from '../helpers/mockObjects';
import { Types } from 'mongoose';

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

/**
 * Create a User mock with userId and select method before importing controllers
 */
const userMock = {
  ...mockUserData,
  _id: 'user-id-123'
};

/**
 * Mock dependencies first, BEFORE importing the modules that use them
 */
jest.mock('@/services/userService', () => ({
  createUser: jest.fn().mockResolvedValue(userMock),
  findUserByEmail: jest.fn().mockResolvedValue(userMock),
  updateUser: jest.fn().mockResolvedValue(userMock)
}));

/**
 * Mock User model with named export (correct way)
 */
jest.mock('@/models/user', () => ({
  User: {
    findById: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(userMock)
    }))
  }
}));

/**
 * Mock Map model
 */
jest.mock('@/models/map', () => ({
  create: jest.fn().mockResolvedValue({})
}));

/**
 * Mock bcrypt for password comparison
 */
jest.mock('bcrypt', () => ({ 
  compare: jest.fn().mockResolvedValue(true) 
}));

/**
 * Mock jsonwebtoken for token generation
 */
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token')
}));

// Import actual modules AFTER mocking
import * as userController from '@/controllers/userController';
import * as userService from '@/services/userService';

/**
 * Simplified references for better readability
 */
const controller = userController;
const service = userService;

/**
 * Log function to display test details with colored output
 */
function logTestDetails(title: string, input: any, expected: any, actual: any) {
  console.log(`\n🔍【Test feature】：${title}\n🟡 Input: ${JSON.stringify(input, null, 2)}\n🟢 Expected output: ${JSON.stringify(expected, null, 2)}\n🔵 Actual output: ${JSON.stringify(actual, null, 2)}\n  `);
}

describe('UserController', () => {
    /**
     * Common test variables
     */
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response> & { locals: { user: { id: string; email: string } } };
    let mockNext: jest.Mock;

    /**
     * Setup before each test to ensure clean state
     */
    beforeEach(() => {
        mockReq = createMockRequest();
        mockRes = createMockResponse() as typeof mockRes;
        // Ensure mockRes.locals.user exists
        if (!mockRes.locals) {
            mockRes.locals = { user: { id: 'test-user-id', email: 'test@example.com' } };
        }
        mockNext = createMockNext();
        jest.clearAllMocks();
    });

    describe('register', () => {
        /**
         * Test successful user registration
         */
        it('should register user successfully', async () => {
            // Prepare test request data
            mockReq.body = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                avatar: ''
            };
            (service.createUser as jest.Mock).mockResolvedValue(userMock);

            // Execute the controller function
            await controller.register(mockReq as Request, mockRes as Response, mockNext);
            
            // Get the actual response from mock
            const actual = (mockRes.json as jest.Mock).mock.calls[0][0];
            
            // Controller returns slightly different format than expected
            const expected = { 
                user: userMock, 
                token: 'mock-token',
                privateMap: {}
            };
            
            // Log test details for debugging
            logTestDetails(
              'User registration (register)',
              mockReq.body,
              expected,
              actual
            );

            // Verify service was called and response was correct
            expect(service.createUser).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expected);
        });
    });

    describe('login', () => {
        /**
         * Test successful user login
         */
        it('should login user successfully', async () => {
            // Prepare test data
            mockReq.body = {
                email: 'test@example.com',
                password: 'password123'
            };
            
            // Mock findUserByEmail to return valid user
            (service.findUserByEmail as jest.Mock).mockResolvedValue(userMock);
            
            // Execute test
            await controller.login(mockReq as Request, mockRes as Response, mockNext);
            
            // Check if next was called (error occurred)
            if (mockNext.mock.calls.length > 0) {
              console.error("Error in login:", mockNext.mock.calls[0][0]);
            }
            
            // Verify service.findUserByEmail was correctly called
            expect(service.findUserByEmail).toHaveBeenCalledWith(mockReq.body.email);
            
            // Check correct HTTP status code
            expect(mockRes.status).toHaveBeenCalledWith(200);
            
            // Prepare expected response
            const expected = { 
              token: 'mock-token', 
              user: userMock 
            };
            
            // Get actual output
            const actual = (mockRes.json as jest.Mock).mock.calls[0][0];
            
            // Output log
            logTestDetails(
              'User login (login)',
              mockReq.body,
              expected,
              actual || { error: "mockRes.json not called" }
            );
            
            // Verify json was correctly called
            expect(mockRes.json).toHaveBeenCalledWith(expected);
        });
    });

    describe('updateCurrentUser', () => {
        /**
         * Test successful user profile update
         */
        it('should update user profile successfully', async () => {
            // Prepare test data
            mockReq.body = {
                username: 'newusername'
            };
            (service.updateUser as jest.Mock).mockResolvedValue(userMock);

            // Execute controller function
            await controller.updateCurrentUser(mockReq as Request, mockRes as Response, mockNext);
            
            // Get actual response
            const actual = (mockRes.json as jest.Mock).mock.calls[0][0];
            
            // Based on actual response format
            const expected = userMock;
            
            // Log test details
            logTestDetails(
              'Update user profile (updateCurrentUser)',
              mockReq.body,
              expected,
              actual
            );

            // Verify service was called with correct parameters and response was as expected
            expect(service.updateUser).toHaveBeenCalledWith(mockRes.locals.user.id, mockReq.body);
            expect(mockRes.json).toHaveBeenCalledWith(expected);
        });
    });
}); 