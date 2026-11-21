import { Router } from 'express';
import {
    createMapPin,
    getMapPinsByMapId,
    updateMapPin,
    deleteMapPin,
} from '@/controllers/mapPinController';
import journeyAlbumRoutes from './journeyAlbumRoutes';
import { addCollaborator } from '@/middlewares/mapMiddleware';
import { checkWritePermission } from '@/middlewares/aclMiddleware';

const router = Router({ mergeParams: true }); // Enable access to parent route parameters

/**
 * @route POST /api/maps/:map_id/pins
 * @description Create a new map pin for a specific map
 * @access Private
 */
router.post('/', checkWritePermission, addCollaborator, createMapPin);

/**
 * @route GET /api/maps/:map_id/pins
 * @description Get all map pins for a specific map
 * @access Private
 */
router.get('/', getMapPinsByMapId);

/**
 * @route PUT /api/maps/:map_id/pins/:id
 * @description Update a map pin by ID
 * @access Private
 */
router.put('/:id', checkWritePermission, addCollaborator, updateMapPin);

/**
 * @route DELETE /api/maps/:map_id/pins/:id
 * @description Delete a map pin by ID
 * @access Private
 */
router.delete('/:id', checkWritePermission, addCollaborator, deleteMapPin);

/**
 * @route /maps/{map_id}/pins/{pin_id}/albums
 * @description Routes for managing journey albums
 * @access Private
 */
router.use('/:pin_id/albums', journeyAlbumRoutes);

export default router;