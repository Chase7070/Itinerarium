import { Request, Response, NextFunction } from 'express';
import { jest } from '@jest/globals';
import { Types } from 'mongoose';

/**
 * Create a mock request object for testing
 * @param data Optional data to include in the request
 * @returns A partial Request object
 */
export const createMockRequest = (data: any = {}) => {
    const req = {
        ...data,
        params: data.params || {},
        query: data.query || {},
        body: data.body || {}
    } as Partial<Request>;
    return req;
};

/**
 * Create a mock response object for testing
 * @returns A partial Response object with mocked methods
 */
export const createMockResponse = () => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res) as any;
    res.json = jest.fn().mockReturnValue(res) as any;
    res.locals = {
        user: {
            id: 'test-user-id',
            email: 'test@example.com'
        }
    };
    return res;
};

/**
 * Create a mock next middleware function
 * @returns A Jest mock function
 */
export const createMockNext = (): jest.Mock => {
    return jest.fn();
};

/**
 * Create a mock file object for file upload testing
 * @param overrides Optional properties to override default values
 * @returns An Express.Multer.File object
 */
export const createMockFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
  fieldname: 'file',
  originalname: 'test-file.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  destination: '/uploads',
  filename: 'test-file.jpg',
  path: '/uploads/test-file.jpg',
  buffer: Buffer.from([]),
  stream: null as any,
  ...overrides
});

/**
 * Create mock user data for user-related testing
 * Compatible with findUserByEmail, User.findById, User.create, etc.
 */
export const mockUserData = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword123',
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
    toObject: jest.fn().mockReturnThis(),
};

/**
 * Create mock map data for map-related testing
 * Compatible with Map.create, Map.findById, etc.
 */
export const mockMapData = {
    _id: new Types.ObjectId(),
    name: 'Test Map',
    description: 'This is a test map',
    owner: 'test-user-id',
    type: 'default',
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
    toObject: jest.fn().mockReturnThis(),
};

/**
 * Create mock map pin data for pin-related testing
 * Includes common Mongoose Document methods
 */
export const mockMapPinData = {
  _id: 'test-pin-id',
  mapId: 'test-map-id',
  latitude: 35.6762,
  longitude: 139.6503,
  title: 'Test Pin',
  description: 'This is a test pin',
  __v: 0,
  $assertPopulated: jest.fn(),
  $clearModifiedPaths: jest.fn(),
  $clone: jest.fn(),
  $createModifiedPathsSnapshot: jest.fn(),
  // Other Mongoose Document methods
} as any;

/**
 * Create mock journey album data for album-related testing
 * Includes common Mongoose Document methods
 */
export const mockJourneyAlbumData = {
  _id: 'test-album-id',
  title: 'Test Album',
  description: 'This is a test album',
  userId: 'test-user-id',
  photos: ['photo1.jpg', 'photo2.jpg'],
  __v: 0,
  $assertPopulated: jest.fn(),
  $clearModifiedPaths: jest.fn(),
  $clone: jest.fn(),
  $createModifiedPathsSnapshot: jest.fn(),
} as any;

/**
 * Create mock share data for sharing functionality testing
 * Includes common Mongoose Document methods
 */
export const mockShareData = {
  _id: 'test-share-id',
  resourceId: 'test-resource-id',
  resourceType: 'map',
  shareCode: 'ABC123',
  expiresAt: new Date(),
  __v: 0,
  $assertPopulated: jest.fn(),
  $clearModifiedPaths: jest.fn(),
  $clone: jest.fn(),
  $createModifiedPathsSnapshot: jest.fn(),
} as any; 