import { Router } from 'express';
import {
    createJourneyAlbum,
    updateJourneyAlbum,
    deleteJourneyAlbum,
    getJourneyAlbumById,
    getAllJourneyAlbums
} from '@/controllers/journeyAlbumController';
import { addCollaborator } from '@/middlewares/mapMiddleware';
import { checkWritePermission } from '@/middlewares/aclMiddleware';

const router = Router({ mergeParams: true }); // Enable access to parent route parameters

/**
 * @route POST /maps/{map_id}/pins/{pin_id}/albums
 * @description Create a new journey album
 * @access Private
 */
router.post('/', checkWritePermission, addCollaborator, createJourneyAlbum);

/**
 * @route GET /maps/{map_id}/pins/{pin_id}/albums/{id}
 * @description Get a single journey album by ID
 * @access Private
 */
router.get('/:id', getJourneyAlbumById);

/**
 * @route PUT /maps/{map_id}/pins/{pin_id}/albums/{id}
 * @description Update a journey album by ID
 * @access Private
 */
router.put('/:id', checkWritePermission, addCollaborator, updateJourneyAlbum);

/**
 * @route DELETE /maps/{map_id}/pins/{pin_id}/albums/{id}
 * @description Delete a journey album by ID
 * @access Private
 */
router.delete('/:id', checkWritePermission, addCollaborator, deleteJourneyAlbum);


/**
 * @route GET /maps/{map_id}/pins/{pin_id}/albums
 * @description Get all journey albums for a specific map pin
 * @access Private
 */
router.get('/', getAllJourneyAlbums);

export default router;