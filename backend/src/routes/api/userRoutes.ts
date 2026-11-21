import { Router } from 'express';
import {
    register, login, getCurrentUser, updateCurrentUser, getUserByEmail
} from '@/controllers/userController';
import { authenticate } from '@/middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateCurrentUser);
router.get('/email/:email', authenticate, getUserByEmail);

export default router;