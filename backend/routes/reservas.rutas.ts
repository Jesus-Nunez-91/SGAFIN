import { Router } from 'express';
import { getReservas, createReserva, updateReservaStatus, deleteReserva } from '../controllers/reservas.controlador';
import { authMiddleware, checkPermission, ROLES } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getReservas);
router.post('/', createReserva);
router.put('/:id/estado', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), updateReservaStatus);
router.delete('/:id', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), deleteReserva);

export default router;
