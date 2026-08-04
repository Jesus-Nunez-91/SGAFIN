import { Router } from 'express';
import { getSolicitudes, createSolicitud, updateSolicitudStatus } from '../controllers/solicitudes.controlador';
import { authMiddleware, checkPermission, ROLES } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getSolicitudes);
router.post('/', createSolicitud);
router.put('/:id/estado', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), updateSolicitudStatus);

export default router;
