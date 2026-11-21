import { Router } from 'express';
import users from './userRoutes';
import upload from './uploadRoutes';
import maps from './mapRoutes';
import { getUserMapPins } from '@/controllers/mapPinController';
import { getShareByCode } from '@/controllers/shareController';
import { authenticate } from '@/middlewares/authMiddleware';


const router = Router();

router.use('/users', users);
router.use('/upload', upload);
router.use('/maps', authenticate, maps);

/**
 * @route GET /api/map-pins/user
 * @description Get all map pins for the current user
 * @access Private
 */
router.get('/map-pins/user', authenticate, getUserMapPins);


/**
 * @route GET /api/share/:code
 * @description Get share information by code
 * @access Private
 */
router.get('/share/:code', authenticate, getShareByCode);

export default router;

