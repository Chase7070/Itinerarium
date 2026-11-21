import { Router } from 'express';
import { createMap, getUserMaps, updateMap, deleteMap } from '@/controllers/mapController';
import mapPinRoutes from './mapPinRoutes';
import shareRoutes from './shareRoutes';
import { authorizeMapAccess } from '@/middlewares/mapMiddleware';
import { validateMapSharing } from '@/middlewares/shareMiddleware';

const router = Router();

/**
 * @route POST /api/maps
 * @description Create a new map
 * @access Private
 */
router.post('/', createMap);

/**
 * @route GET /api/maps
 * @description Get all maps for the current user
 * @access Private
 */
router.get('/', getUserMaps);

/**
 * @route PUT /api/maps/:id
 * @description Update a map by ID
 * @access Private
 */
router.put('/:id', updateMap);

/**
 * @route DELETE /api/maps/:id
 * @description Delete a map by ID
 * @access Private
 */
router.delete('/:id', deleteMap);


/**
 * @route /api/maps/:map_id/pins
 * @description Routes for managing map pins
 * @access Private
 */
router.use('/:map_id/pins', authorizeMapAccess, mapPinRoutes);


/**
 * @route /api/maps/:map_id/share
 * @access Private
 */
router.use('/:map_id/share', validateMapSharing, shareRoutes);

export default router;