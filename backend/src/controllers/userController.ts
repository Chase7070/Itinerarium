import { Request, Response, NextFunction } from 'express';
import { createUser, findUserByEmail, updateUser } from '@/services/userService';
import { User } from '@/models/user';
import { MongoServerError } from 'mongodb';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import config from '@/config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as yup from 'yup';
import fs from 'fs';
import path from 'path';
import Map from '@/models/map';

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: testuser
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               avatar:
 *                 type: string
 *                 example: avatars/example.jpg
 *             required:
 *               - email
 *               - username
 *               - password
 *               - avatar
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const registerSchema = yup.object().shape({
        email: yup.string().email().required(),
        username: yup.string().min(3).required(),
        password: yup.string().min(6).required(),
        avatar: yup
            .string()
            .optional()
            .test('is-valid-avatar', 'Avatar file does not exist in public directory', (value) => {
                if (!value) return true;
                const avatarPath = path.join(config.public_dir, value); // Adjust the path to your public directory
                return fs.existsSync(avatarPath); // Check if the file exists
            }),
    });

    try {
        const validatedUser = await registerSchema.validate(req.body);
        const user = await createUser({
            ...validatedUser,
            avatar: validatedUser.avatar || '',
        });

        // Generate JWT
        const token = jwt.sign({ id: user._id, name: user.username, email: user.email }, config.jwt_secret, { expiresIn: '24h' });

        // Create a private map for the user
        const privateMap = await Map.create({
            name: `${user.username}'s Map`,
            type: 'default',
            description: 'This is your map.',
            owner: user._id,
        });

        res.status(201).json({ token, user: user, privateMap });
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            error = new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.DATA_EXISTED, 'Email already exists');
        }
        next(error);
    }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful and user information returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid email or password
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const loginSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
    });

    try {
        const validatedUser = await loginSchema.validate(req.body);
        const user = await findUserByEmail(validatedUser.email);

        if (!user) {
            throw new ApiError(ApiErrorCode.UNAUTHORIZED, ApiErrorReason.INVALID_CREDENTIALS, 'Invalid email or password');
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(validatedUser.password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(ApiErrorCode.UNAUTHORIZED, ApiErrorReason.INVALID_CREDENTIALS, 'Invalid email or password');
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, name: user.username, email: user.email }, config.jwt_secret, { expiresIn: '24h' });

        // Fetch user information
        const userInfo = await User.findById(user._id).select('-password'); // Exclude password

        res.status(200).json({ token, user: userInfo });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the current user's information
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = res.locals.user.id; // Assume `req.user` is populated by authentication middleware
        const user = await User.findById(userId); // Exclude password from response
        if (!user) {
            throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update the current user's information
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: updateduser
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: newpassword123
 *               avatar:
 *                 type: string
 *                 example: avatars/updated.jpg
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export const updateCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const updateSchema = yup.object().shape({
        username: yup.string().min(3).optional(),
        password: yup.string().min(6).optional(),
        avatar: yup
            .string()
            .optional()
            .test('is-valid-avatar', 'Avatar file does not exist in public directory', (value) => {
                if (!value) return true; // Skip validation if avatar is not provided
                const avatarPath = path.join(config.public_dir, value); // Adjust the path to your public directory
                return fs.existsSync(avatarPath); // Check if the file exists
            }),
    });

    try {
        const userId = res.locals.user.id; // Assume `req.user` is populated by authentication middleware
        const validatedUser = await updateSchema.validate(req.body);

        const updatedUser = await updateUser(userId, validatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get user information by email
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: The email of the user to retrieve
 *         schema:
 *           type: string
 *           format: email
 *           example: user@example.com
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the user
 *                     email:
 *                       type: string
 *                       description: The email of the user
 *                     username:
 *                       type: string
 *                       description: The username of the user
 *                     avatar:
 *                       type: string
 *                       description: The avatar URL of the user
 *       400:
 *         description: Invalid email format
 *       404:
 *         description: User not found
 */
export const getUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.params;
        const user = await findUserByEmail(email);
        if (!user) {
            throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'User not found');
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};