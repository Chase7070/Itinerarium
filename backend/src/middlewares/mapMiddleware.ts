import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import { validateMapAccess } from '@/services/mapService';
import mongoose from 'mongoose';


/**
 * Middleware to authorize access to a specific map.
 * 
 * This middleware checks if the authenticated user has access to the requested map.
 * Access is granted if:
 * - The user is the owner of the map.
 * - The user is listed in the map's share `relevant_ids`.
 * - The map's share range is set to "anyone".
 * 
 * If access is denied, a `403 Forbidden` error is returned.
 */
export const authorizeMapAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mapId = req.params.map_id; // Extract map_id from the route parameter
        const userId = res.locals.user?.id; // Get the authenticated user's ID from res.locals

        if (!mapId) {
            throw new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, 'Map ID is required');
        }

        // Validate map access
        const userpermission = await validateMapAccess(mapId, userId);
        res.locals.user_permission = userpermission; // Attach permission info to res.locals

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error);
    }
};


/**
 * Middleware to add the authenticated user as a collaborator to a map.
 * 
 * This middleware retrieves the map from `res.locals.map` and the user ID from `res.locals.user`.
 * If the user is not already a collaborator, they are added to the map's `collaborators` array.
 * Duplicates are removed before saving the map.
 */
export const addCollaborator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const map = res.locals.map; // Retrieve the map from res.locals
        const userId = res.locals.user?.id; // Get the authenticated user's ID from res.locals

        if (!map || !userId) {
            return next(); // Skip if map or userId is not available
        }

        // Add the user to the collaborators array
        map.collaborators.push(userId);

        // Remove duplicates
        map.collaborators = Array.from(
            new Set(map.collaborators.map((id: mongoose.Types.ObjectId) => id.toString()))
        );

        // Save the updated map
        await map.save();

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Failed to add collaborator:', error);
        next(error); // Pass the error to the error-handling middleware
    }
};