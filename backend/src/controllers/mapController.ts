import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import * as mapService from '@/services/mapService';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

/**
 * @swagger
 * /api/maps:
 *   post:
 *     summary: Create a new map
 *     description: Create a new map owned by the authenticated user.
 *     tags:
 *       - Map
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the map.
 *                 example: My Map
 *               description:
 *                 type: string
 *                 description: A description of the map.
 *                 example: This is my personal map.
 *     responses:
 *       201:
 *         description: Map created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 map:
 *                   $ref: '#/components/schemas/Map'
 *       400:
 *         description: Invalid input or validation error.
 */
export const createMap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = yup.object().shape({
        name: yup.string().max(20).optional(),
        description: yup.string().max(100).optional(),
    });

    try {
        const validatedData = await schema.validate(req.body);
        const map = await mapService.createMap(res.locals.user.id, validatedData);
        res.status(201).json({ map });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            next(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, error.message));
        } else {
            next(error);
        }
    }
};

/**
 * @swagger
 * /api/maps:
 *   get:
 *     summary: Get all maps for the current user
 *     description: Retrieve all maps where the authenticated user is the owner or a collaborator.
 *     tags:
 *       - Map
 *     responses:
 *       200:
 *         description: A list of maps where the user is the owner or a collaborator.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Map'
 *       401:
 *         description: Unauthorized access.
 */
export const getUserMaps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const maps = await mapService.getUserMaps(res.locals.user.id);
        res.status(200).json({ maps });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/maps/{id}:
 *   put:
 *     summary: Update a map by ID
 *     description: Update the name or description of a specific map owned by the authenticated user.
 *     tags:
 *       - Map
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the map to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the map.
 *               description:
 *                 type: string
 *                 description: The new description of the map.
 *     responses:
 *       200:
 *         description: Map updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Map'
 *       400:
 *         description: Invalid input or validation error.
 *       404:
 *         description: Map not found.
 */
export const updateMap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = yup.object().shape({
        name: yup.string().optional(),
        description: yup.string().optional(),
    });

    try {
        const updates = await schema.validate(req.body);
        const map = await mapService.updateMap(res.locals.user.id, req.params.id, updates);
        res.status(200).json({ map });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            next(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, error.message));
        } else {
            next(error);
        }
    }
};

/**
 * @swagger
 * /api/maps/{id}:
 *   delete:
 *     summary: Delete a map by ID
 *     description: Delete a specific map owned by the authenticated user. Ensures the user has at least one private map remaining.
 *     tags:
 *       - Map
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the map to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Map deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Map deleted successfully.
 *       400:
 *         description: Invalid input or validation error.
 *       404:
 *         description: Map not found.
 */
export const deleteMap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await mapService.deleteMap(res.locals.user.id, req.params.id);
        res.status(200).json({ message: 'Map deleted successfully' });
    } catch (error) {
        next(error);
    }
};
