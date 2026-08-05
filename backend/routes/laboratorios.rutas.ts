import { Router } from 'express';
import { getLaboratorios, createLaboratorio, updateLaboratorio, deleteLaboratorio, getArticulos, createArticulo, updateArticulo, deleteArticulo } from '../controllers/laboratorios.controlador';
import { authMiddleware, checkPermission, ROLES } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getLaboratorios);
router.post('/', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), createLaboratorio);
router.put('/:id', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), updateLaboratorio);
router.delete('/:id', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), deleteLaboratorio);

router.get('/articulos', getArticulos);
router.post('/articulos', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), createArticulo);
router.put('/articulos/:id', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), updateArticulo);
router.delete('/articulos/:id', checkPermission([ROLES.ADMIN, ROLES.LAB_ADMIN]), deleteArticulo);

export default router;
