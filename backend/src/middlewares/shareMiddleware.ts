import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import Map from '@/models/map';

/**
 * Middleware to validate map sharing actions.
 * 
 * This middleware ensures that:
 * - The map exists in the database.
 * - The authenticated user is the owner of the map.
 * - The map is not of type "default" (default maps cannot be shared).
 * 
 * If any of these conditions are not met, an appropriate error is returned.
 */
export const validateMapSharing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mapId = req.params.map_id; // Extract map_id from the route parameter
        const userId = res.locals.user?.id; // Get the authenticated user's ID from res.locals

        if (!mapId) {
            return next(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, 'Map ID is required'));
        }

        // Re-fetch the map from the database
        const map = await Map.findById(mapId);

        if (!map) {
            return next(new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map not found'));
        }

        // Check if the current user is the owner of the map
        if (map.owner.toString() !== userId) {
            return next(new ApiError(ApiErrorCode.FORBIDDEN, ApiErrorReason.ACCESS_DENIED, 'Only the map owner can perform this action'));
        }

        // Check if the map type is "default"
        if (map.type === 'default') {
            return next(new ApiError(ApiErrorCode.FORBIDDEN, ApiErrorReason.ACCESS_DENIED, 'Default maps cannot be shared'));
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error);
    }
};