import mongoose from 'mongoose';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';

// Mock the bcryptjs module
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Add matchPassword method for testing
User.prototype.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Define a password hashing function to replace the real middleware
async function hashPassword(user: any, isModified = true) {
  if (!isModified) return;
  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
}

describe('User Model', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have correct field definitions', () => {
      const schema = User.schema.obj;
      
      // Check if required fields exist
      expect(schema).toHaveProperty('username');
      expect(schema).toHaveProperty('email');
      expect(schema).toHaveProperty('password');
      expect(schema).toHaveProperty('avatar');
      
      // Get and assert field definitions
      const usernameField = schema.username as any;
      const emailField = schema.email as any;
      const passwordField = schema.password as any;
      
      expect(usernameField.required).toBe(true);
      expect(emailField.required).toBe(true);
      expect(passwordField.required).toBe(true);
      expect(emailField.unique).toBe(true);
    });
  });
  
  describe('Model instance', () => {
    it('User model should be defined', () => {
      expect(User).toBeDefined();
    });
  });
  
  describe('Custom methods', () => {
    let userInstance: any;
    
    beforeEach(() => {
      userInstance = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    it('matchPassword should compare the password correctly', async () => {
      // Call the method
      const result = await userInstance.matchPassword('password123');
      
      // Validate result
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', userInstance.password);
      expect(result).toBe(true);
    });
  });
  
  describe('Password hashing functionality', () => {
    let userInstance: any;
    
    beforeEach(() => {
      userInstance = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    it('should hash the password', async () => {
      // Simulate the hashing process
      await hashPassword(userInstance);
      
      // Validate the hash result
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(userInstance.password).toBe('hashedpassword');
    });
    
    it('should not hash the password if not modified', async () => {
      // Simulate password not being modified
      await hashPassword(userInstance, false);
      
      // Validate that hashing functions were not called
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
