import { Router } from 'express';
import { getAuditoria } from '../controllers/auditoria.controlador';
import { authMiddleware, checkPermission, ROLES } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', checkPermission([ROLES.ADMIN]), getAuditoria);

export default router;
