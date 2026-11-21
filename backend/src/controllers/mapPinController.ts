import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import MapPin from '@/models/mapPin';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import * as mapPinService from '@/services/mapPinService';

/**
 * @swagger
 * /api/maps/{map_id}/pins:
 *   post:
 *     summary: Create a new map pin
 *     tags:
 *       - MapPins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: map_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the map
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               geo_location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: -36.8485
 *                   lng:
 *                     type: number
 *                     example: 174.7633
 *                 required:
 *                   - lat
 *                   - lng
 *               country:
 *                 type: string
 *                 example: New Zealand
 *               city:
 *                 type: string
 *                 example: Auckland
 *             required:
 *               - geo_location
 *     responses:
 *       201:
 *         description: Map pin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mapPin:
 *                   $ref: '#/components/schemas/MapPin'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Resource not found
 */
export const createMapPin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = yup.object().shape({
        geo_location: yup.object({
            lat: yup.number().required('Latitude is required'),
            lng: yup.number().required('Longitude is required'),
        }).required('Geo location is required'),
        country: yup.string().optional(),
        city: yup.string().optional(),
    });

    try {
        const validatedData = await schema.validate(req.body);
        const { map_id } = req.params;
        const userId = res.locals.user?.id;

        const mapPin = await mapPinService.createMapPin(map_id, userId, validatedData);
        res.status(201).json({ mapPin });
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
 * /api/maps/{map_id}/pins:
 *   get:
 *     summary: Get all map pins for a specific map
 *     tags:
 *       - MapPins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: map_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the map
 *     responses:
 *       200:
 *         description: List of map pins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mapPins:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MapPin'
 *       400:
 *         description: Validation error
 */
export const getMapPinsByMapId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mapPins = await mapPinService.getMapPinsByMapId(req.params.map_id);
        res.status(200).json({ mapPins });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/maps/{map_id}/pins/{id}:
 *   put:
 *     summary: Update a map pin by ID
 *     tags:
 *       - MapPins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: map_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the map
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the map pin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               geo_location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Map pin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mapPin:
 *                   $ref: '#/components/schemas/MapPin'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Map pin not found
 */
export const updateMapPin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bodySchema = yup.object().shape({
        geo_location: yup.object({
            lat: yup.number().optional(),
            lng: yup.number().optional(),
        }).optional(),
        country: yup.string().optional(),
        city: yup.string().optional(),
    });

    try {
        const updates = await bodySchema.validate(req.body);
        const mapPin = await mapPinService.updateMapPin(req.params.id, updates);
        res.status(200).json({ mapPin });
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
 * /api/maps/{map_id}/pins/{id}:
 *   delete:
 *     summary: Delete a map pin by ID
 *     tags:
 *       - MapPins
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: map_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the map
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the map pin
 *     responses:
 *       200:
 *         description: Map pin deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Map pin deleted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Map pin not found
 */
export const deleteMapPin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await mapPinService.deleteMapPin(req.params.id);
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/map-pins:
 *   get:
 *     summary: Get all map pins for the current user
 *     description: Retrieve all map pins associated with maps where the authenticated user is the owner or a collaborator. Includes user details for each pin.
 *     tags:
 *       - MapPin
 *     responses:
 *       200:
 *         description: A list of map pins with user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the map pin.
 *                   map_id:
 *                     type: string
 *                     description: The ID of the map associated with the pin.
 *                   user_id:
 *                     type: object
 *                     description: The user details associated with the pin.
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the user.
 *                       email:
 *                         type: string
 *                         description: The email of the user.
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: No maps or pins found for the user.
 */
export const getUserMapPins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mapPins = await mapPinService.getUserMapPins(res.locals.user?.id);
        res.status(200).json({ mapPins });
    } catch (error) {
        next(error);
    }
};