import { Router } from 'express';
import { getBloques, createBloque, getHorarios, createHorario, deleteHorario } from '../controllers/horario-academico.controlador';
import { authMiddleware, checkPermission, ROLES } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/bloques', getBloques);
router.post('/bloques', checkPermission(['Administrador', 'SuperUser', 'Admin_Acade', 'Admin_Labs']), createBloque);

router.get('/', getHorarios);
router.post('/', checkPermission(['Administrador', 'SuperUser', 'Admin_Acade', 'Admin_Labs']), createHorario);
router.delete('/:id', checkPermission(['Administrador', 'SuperUser', 'Admin_Acade', 'Admin_Labs']), deleteHorario);

export default router;
