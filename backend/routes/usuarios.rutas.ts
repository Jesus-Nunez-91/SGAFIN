import { Router } from 'express';
import { getUsuarios, createUsuario, updateUsuario, personalizarUsuario, aprobarUsuario } from '../controllers/usuarios.controlador';
import { authMiddleware, checkPermission, ROLES } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.post('/personalizar', personalizarUsuario);
router.post('/:id/aprobar', checkPermission(['SuperUser']), aprobarUsuario);

router.get('/', checkPermission([ROLES.ADMIN]), getUsuarios);
router.post('/', checkPermission([ROLES.ADMIN]), createUsuario);
router.put('/:id', checkPermission([ROLES.ADMIN]), updateUsuario);

export default router;
