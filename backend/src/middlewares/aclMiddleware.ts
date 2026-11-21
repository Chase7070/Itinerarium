import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

/**
 * Middleware to check if the user has write permission.
 * Only users with write permission can perform certain actions (e.g., creating a pin).
 */
export const checkWritePermission = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const userPermission = res.locals.user_permission; // Retrieve permission from res.locals

        if (userPermission !== 'write') {
            throw new ApiError(
                ApiErrorCode.FORBIDDEN,
                ApiErrorReason.ACCESS_DENIED,
                'You do not have write permission to perform this action'
            );
        }

        next(); // User has write permission, proceed to the next middleware or route handler
    } catch (error) {
        next(error);
    }
};