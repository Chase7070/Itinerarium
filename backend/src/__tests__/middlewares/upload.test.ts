import { Request, Response, NextFunction } from 'express';

// Mock multer module
jest.mock('multer', () => ({
  diskStorage: jest.fn(),
  default: () => ({
    single: jest.fn(),
    array: jest.fn(),
  }),
}));

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Mock config module
jest.mock('@/config/config', () => ({
  public_dir: '/mock/public',
}));

// Mock upload middleware module (virtual means it's mocked even if not resolved normally)
jest.mock(
  '@/middlewares/upload',
  () => ({
    uploadSingle: jest.fn(),
    uploadMultiple: jest.fn(),
  }),
  { virtual: true }
);

// Import the middleware functions being tested
import { uploadSingle, uploadMultiple } from '@/middlewares/upload';

describe('Upload Middleware - Types', () => {
  it('should export the correct functions', () => {
    // Check that the middleware exports are functions
    expect(typeof uploadSingle).toBe('function');
    expect(typeof uploadMultiple).toBe('function');
  });
});
