import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import config from "@/config/config";
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
        return next(new ApiError(ApiErrorCode.UNAUTHORIZED, ApiErrorReason.AUTHENTICATION_FAILED, 'Authentication token is required'));
    }

    try {
        const decoded = jwt.verify(token, config.jwt_secret) as { id: string; name: string; email: string };
        res.locals.user = decoded; // Attach decoded user info to the request object
        next();
    } catch (error) {
        return next(new ApiError(ApiErrorCode.UNAUTHORIZED, ApiErrorReason.AUTHENTICATION_FAILED, 'Invalid or expired token'));
    }
};

export const conditionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    const requireAuth = req.query.scene !== 'profile'; // Check if authentication is required
    if (requireAuth) {
        authenticate(req, res, next); // Call the authentication middleware
    } else {
        next(); // Skip authentication
    }
};