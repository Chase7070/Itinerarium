import * as userService from '@/services/userService';
import { User } from '@/models/user';
import bcrypt from 'bcrypt';
import { mockUserData } from '../helpers/mockObjects';

/**
 * Mock User model and bcrypt for isolated testing
 */
jest.mock('@/models/user');
jest.mock('bcrypt');

describe('userService', () => {
    /**
     * Clear all mocks before each test to ensure test isolation
     */
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        /**
         * Test user creation with password hashing
         */
        it('should create user with hashed password', async () => {
            // Mock bcrypt hash to return a predictable hash value
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword123');
            
            // Mock User model to return mockUserData when saved
            (User as any).mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockUserData)
            }));

            // Call the service method
            const result = await userService.createUser({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
                avatar: ''
            });

            // Verify bcrypt was called and result matches expected
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(result).toEqual(mockUserData);
        });
    });

    describe('findUserByEmail', () => {
        /**
         * Test finding user by email
         */
        it('should find user by email', async () => {
            // Mock User.findOne to return mockUserData
            (User.findOne as jest.Mock).mockResolvedValue(mockUserData);
            
            // Call the service method
            const result = await userService.findUserByEmail('test@example.com');
            
            // Verify User.findOne was called with correct parameters and result matches expected
            expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(mockUserData);
        });
    });

    describe('updateUser', () => {
        /**
         * Test updating user with password change (requires hashing)
         */
        it('should update user and hash password if provided', async () => {
            // Mock bcrypt hash and User.findByIdAndUpdate
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword123');
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUserData);
            
            // Call the service method with password update
            const result = await userService.updateUser('test-user-id', { password: 'newpassword' });
            
            // Verify bcrypt.hash and User.findByIdAndUpdate were called correctly
            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('test-user-id', { password: 'hashedpassword123' }, { new: true });
            expect(result).toEqual(mockUserData);
        });

        /**
         * Test updating user without password change
         */
        it('should update user without password', async () => {
            // Mock User.findByIdAndUpdate
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUserData);
            
            // Call the service method without password update
            const result = await userService.updateUser('test-user-id', { username: 'newname' });
            
            // Verify User.findByIdAndUpdate was called with correct parameters
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('test-user-id', { username: 'newname' }, { new: true });
            expect(result).toEqual(mockUserData);
        });
    });
}); 