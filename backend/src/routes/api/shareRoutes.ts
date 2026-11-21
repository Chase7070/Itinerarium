import express from 'express';
import { updateShare } from '@/controllers/shareController';

const router = express.Router({ mergeParams: true });

// Update share information for a map
router.put('/', updateShare);

export default router;