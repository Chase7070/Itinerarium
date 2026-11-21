import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import * as shareService from '@/services/shareService';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

/**
 * @swagger
 * /api/maps/{map_id}/share:
 *   put:
 *     summary: Update the sharing settings of a map
 *     description: Update the sharing settings (range and relevant users) for a specific map. Only the map owner can perform this action.
 *     tags:
 *       - Share
 *     parameters:
 *       - name: map_id
 *         in: path
 *         required: true
 *         description: The ID of the map to update sharing settings for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               range:
 *                 type: string
 *                 description: The sharing range of the map.
 *                 enum: [private, anyone, assigned]
 *                 example: assigned
 *               relevant_ids:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user ID to assign access to the map.
 *                     permission:
 *                       type: string
 *                       enum: [read, write]
 *                       description: The permission level for the user.
 *                 description: A list of user IDs and their permissions (required if range is "assigned").
 *                 example:
 *                   - id: "user1_id"
 *                     permission: "read"
 *                   - id: "user2_id"
 *                     permission: "write"
 *     responses:
 *       200:
 *         description: Sharing settings updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 share:
 *                   type: object
 *                   description: The updated sharing settings.
 *                   properties:
 *                     range:
 *                       type: string
 *                       description: The sharing range of the map.
 *                     relevant_ids:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The user ID.
 *                           permission:
 *                             type: string
 *                             enum: [read, write]
 *                             description: The user's permission level.
 *       400:
 *         description: Invalid input or validation error.
 *       404:
 *         description: Map or share information not found.
 *       403:
 *         description: Access denied. Only the map owner can update sharing settings.
 */
export const updateShare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const schema = yup.object().shape({
        range: yup.string().oneOf(['private', 'anyone', 'assigned']).required(),
        relevant_ids: yup
            .array()
            .of(
                yup.object().shape({
                    id: yup.string().required(), // User ID
                    permission: yup.string().oneOf(['read', 'write']).required(), // Permission type
                })
            )
            .optional(),
    });

    try {
        const validatedData = await schema.validate(req.body);
        const share = await shareService.updateShare(req.params.map_id, validatedData);
        res.status(200).json({ share });
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
 * /api/shares/code/{code}:
 *   get:
 *     summary: Get share information by code
 *     description: Retrieve share information by its code. Only users with access to the associated map can perform this action.
 *     tags:
 *       - Share
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: The unique code of the share to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Share information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 share:
 *                   type: object
 *                   description: The share information.
 *                   properties:
 *                     range:
 *                       type: string
 *                       description: The sharing range of the map.
 *                     relevant_ids:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The user ID.
 *                           permission:
 *                             type: string
 *                             enum: [read, write]
 *                             description: The user's permission level.
 *                 permission:
 *                   type: string
 *                   enum: [read, write]
 *                   description: The current user's permission level for the share.
 *       403:
 *         description: Access denied. The user does not have permission to view this share.
 *       404:
 *         description: Share not found.
 */
export const getShareByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const code = req.params.code; // Extract code from the route parameter

        if (!code) {
            return next(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, 'Share code is required'));
        }

        // Delegate the logic to the service layer
        const { share, permission } = await shareService.getShareByCode(code, res.locals.user);

        res.status(200).json({ share, permission });
    } catch (error) {
        next(error);
    }
};