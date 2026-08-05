import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Solicitud } from '../../src/entities/Solicitud';
import { RegistroAuditoria } from '../../src/entities/RegistroAuditoria';

const audit = async (usuarioId: number, accion: string, modulo: string, detalles: string) => {
    const repo = AppDataSource.getRepository(RegistroAuditoria);
    await repo.save(repo.create({ usuarioId, accion, modulo, detalles }));
};

export const getSolicitudes = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Solicitud);
    // User sees their own requests, admin sees all
    const isAdmin = ['Administrador', 'Encargado Laboratorio'].includes(req.user.rol);
    const filter = isAdmin ? {} : { usuarioId: req.user.id };
    
    const items = await repo.find({ where: filter, order: { createdAt: 'DESC' } });
    res.json(items);
};

export const createSolicitud = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Solicitud);
    const payload = { ...req.body, usuarioId: req.user.id };
    const nuevo = repo.create(payload);
    const guardado = await repo.save(nuevo) as any;
    await audit(req.user.id, 'CREAR', 'Solicitud', `Solicitud creada tipo: ${guardado.tipoSolicitud}`);
    res.status(201).json(guardado);
};

export const updateSolicitudStatus = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Solicitud);
    const item = await repo.findOneBy({ id: parseInt(req.params.id) });
    if (!item) return res.status(404).json({ message: 'No encontrado' });

    item.estado = req.body.estado;
    if (req.body.respuestaAdmin) item.respuestaAdmin = req.body.respuestaAdmin;
    
    const guardado = await repo.save(item);
    await audit(req.user.id, 'ACTUALIZAR', 'Solicitud', `Estado actualizado a: ${item.estado}`);
    res.json(guardado);
};
