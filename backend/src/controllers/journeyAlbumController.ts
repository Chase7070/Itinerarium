import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import * as journeyAlbumService from '@/services/journeyAlbumService';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';


/**
 * @swagger
 * /api/maps/{map_id}/pins/{pin_id}/albums/{id}:
 *   get:
 *     summary: Get a single journey album by ID
 *     description: Retrieve a specific journey album by its ID. Only the owner of the album can access it.
 *     tags:
 *       - JourneyAlbum
 *     parameters:
 *       - name: map_id
 *         in: path
 *         required: true
 *         description: The ID of the map.
 *         schema:
 *           type: string
 *       - name: pin_id
 *         in: path
 *         required: true
 *         description: The ID of the map pin.
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the journey album.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journey album retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 journeyAlbum:
 *                   $ref: '#/components/schemas/JourneyAlbum'
 */
export const getJourneyAlbumById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const albumId = req.params.id; // Get album ID from route params
        const userId = res.locals.user?.id; // Get user_id from token

        // Call service to get the journey album
        const journeyAlbum = await journeyAlbumService.getJourneyAlbumById(albumId, userId);

        res.status(200).json({ journeyAlbum });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/maps/{map_id}/pins/{pin_id}/albums:
 *   post:
 *     summary: Create a new journey album
 *     description: Create a new journey album for a specific map pin. Only the authenticated user can create an album.
 *     tags:
 *       - JourneyAlbum
 *     parameters:
 *       - name: map_id
 *         in: path
 *         required: true
 *         description: The ID of the map.
 *         schema:
 *           type: string
 *       - name: pin_id
 *         in: path
 *         required: true
 *         description: The ID of the map pin.
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
 *                 description: The album's name.
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: The key of the image.
 *     responses:
 *       201:
 *         description: Journey album created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 journeyAlbum:
 *                   $ref: '#/components/schemas/JourneyAlbum'
 */
export const createJourneyAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        images: yup
            .array()
            .of(
                yup.object().shape({
                    key: yup.string().required('Image key is required'),
                })
            )
            .optional(), // Images are optional
    });

    try {
        // Validate request body
        const validatedData = await schema.validate(req.body);

        const mapId = req.params.map_id; // Get map_id from route params
        const mapPinId = req.params.pin_id; // Get map_pin_id from route params
        const userId = res.locals.user?.id;  // Get user_id from token (res.locals.user is set by the authentication middleware)

        // Call service to create the journey album
        const journeyAlbum = await journeyAlbumService.createJourneyAlbum(mapId, mapPinId, userId, validatedData);

        res.status(201).json({ journeyAlbum });
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
 * /api/maps/{map_id}/pins/{pin_id}/albums/{id}:
 *   put:
 *     summary: Update a journey album by ID
 *     description: Update the details of a specific journey album. Only the owner of the album can update it.
 *     tags:
 *       - JourneyAlbum
 *     parameters:
 *       - name: map_id
 *         in: path
 *         required: true
 *         description: The ID of the map.
 *         schema:
 *           type: string
 *       - name: pin_id
 *         in: path
 *         required: true
 *         description: The ID of the map pin.
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the journey album.
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
 *                 description: The album's name.
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: The key of the image.
 *     responses:
 *       200:
 *         description: Journey album updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 journeyAlbum:
 *                   $ref: '#/components/schemas/JourneyAlbum'
 *       400:
 *         description: Invalid input or validation error.
 */
export const updateJourneyAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = yup.object().shape({
        name: yup.string().optional(),
        images: yup
            .array()
            .of(
                yup.object().shape({
                    key: yup.string().required('Image key is required'),
                })
            )
            .optional(),
    });

    try {
        // Validate request body
        const validatedData = await schema.validate(req.body);

        // Get album ID from route params
        const albumId = req.params.id;

        // Call service to update the journey album
        const journeyAlbum = await journeyAlbumService.updateJourneyAlbum(albumId, validatedData);

        res.status(200).json({ journeyAlbum });
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
 * /api/maps/{map_id}/pins/{pin_id}/albums/{id}:
 *   delete:
 *     summary: Delete a journey album by ID
 *     description: Delete a specific journey album. Only the owner of the album can delete it.
 *     tags:
 *       - JourneyAlbum
 *     parameters:
 *       - name: map_id
 *         in: path
 *         required: true
 *         description: The ID of the map.
 *         schema:
 *           type: string
 *       - name: pin_id
 *         in: path
 *         required: true
 *         description: The ID of the map pin.
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the journey album.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journey album deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Journey album deleted successfully.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Journey album not found.
 */
export const deleteJourneyAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const albumId = req.params.id; // Get album ID from route params
        const userId = res.locals.user?.id; // Get user_id from token

        // Call service to delete the journey album
        await journeyAlbumService.deleteJourneyAlbum(albumId, userId);

        res.status(200).json({ message: 'Journey album deleted successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/maps/{map_id}/pins/{pin_id}/albums:
 *   get:
 *     summary: Get all journey albums for a specific map pin
 *     description: Retrieve all journey albums associated with a specific map pin. Only the owner of the albums can access them.
 *     tags:
 *       - JourneyAlbum
 *     parameters:
 *       - name: map_id
 *         in: path
 *         required: true
 *         description: The ID of the map.
 *         schema:
 *           type: string
 *       - name: pin_id
 *         in: path
 *         required: true
 *         description: The ID of the map pin.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journey albums retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 journeyAlbums:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the journey album.
 *                       name:
 *                         type: string
 *                         description: The name of the journey album.
 *                       images:
 *                         type: array
 *                         description: An array of images associated with the journey album.
 *                         items:
 *                           type: object
 *                           properties:
 *                             key:
 *                               type: string
 *                               description: The key of the image.
 *                       map_pin_id:
 *                         type: string
 *                         description: The ID of the associated map pin.
 *                       map_id:
 *                         type: string
 *                         description: The ID of the associated map.
 *                       user_id:
 *                         type: string
 *                         description: The ID of the user who created the journey album.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the journey album was created.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the journey album was last updated.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: No journey albums found for the specified map pin.
 */
export const getAllJourneyAlbums = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mapPinId = req.params.pin_id; // Get map_pin_id from route params
        const userId = res.locals.user?.id; // Get user_id from token

        // Call service to get all journey albums
        const journeyAlbums = await journeyAlbumService.getAllJourneyAlbums(mapPinId);

        res.status(200).json({ journeyAlbums });
    } catch (error) {
        next(error);
    }
};