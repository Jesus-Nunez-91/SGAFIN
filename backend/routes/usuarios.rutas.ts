import { Router } from 'express';
import { getUsuarios, createUsuario, updateUsuario } from '../controllers/usuarios.controlador';
import { authMiddleware, checkPermission, ROLES } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', checkPermission([ROLES.ADMIN]), getUsuarios);
router.post('/', checkPermission([ROLES.ADMIN]), createUsuario);
router.put('/:id', checkPermission([ROLES.ADMIN]), updateUsuario);

export default router;
