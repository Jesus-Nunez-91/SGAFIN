import { Router } from 'express';
import { login, register, getMe } from '../controllers/autenticacion.controlador';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.post('/login', login);
router.post('/registro', register);
router.get('/me', authMiddleware, getMe);

export default router;
