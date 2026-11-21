import { Router } from 'express';
import { uploadSingle, uploadMultiple } from '@/middlewares/upload';
import { uploadFile, uploadFiles } from '@/controllers/uploadController';
import { conditionalAuth } from '@/middlewares/authMiddleware';

const router = Router();

/**
 * @route POST /api/upload
 * @description Upload a single file
 */
router.post('/', conditionalAuth, uploadSingle, uploadFile);

/**
 * @route POST /api/upload/multiple
 * @description Upload multiple files
 */
router.post('/multiple', conditionalAuth, uploadMultiple, uploadFiles);

export default router;