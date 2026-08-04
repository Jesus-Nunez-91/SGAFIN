import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Laboratorio } from '../../src/entities/Laboratorio';
import { ArticuloLaboratorio } from '../../src/entities/ArticuloLaboratorio';
import { RegistroAuditoria } from '../../src/entities/RegistroAuditoria';

const audit = async (usuarioId: number, accion: string, modulo: string, detalles: string) => {
    const repo = AppDataSource.getRepository(RegistroAuditoria);
    await repo.save(repo.create({ usuarioId, accion, modulo, detalles }));
};

export const getLaboratorios = async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Laboratorio);
    const laboratorios = await repo.find();
    res.json(laboratorios);
};

export const createLaboratorio = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Laboratorio);
    const nuevo = repo.create(req.body);
    const guardado = await repo.save(nuevo) as any;
    await audit(req.user.id, 'CREAR', 'Laboratorios', `Creado laboratorio: ${guardado.nombre}`);
    res.status(201).json(guardado);
};

export const updateLaboratorio = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Laboratorio);
    const item = await repo.findOneBy({ id: parseInt(req.params.id) });
    if (!item) return res.status(404).json({ message: 'Laboratorio no encontrado' });

    Object.assign(item, req.body);
    const guardado = await repo.save(item);
    await audit(req.user.id, 'ACTUALIZAR', 'Laboratorios', `Actualizado laboratorio ID: ${guardado.id}`);
    res.json(guardado);
};

export const deleteLaboratorio = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Laboratorio);
    await repo.delete(req.params.id);
    await audit(req.user.id, 'ELIMINAR', 'Laboratorios', `Eliminado laboratorio ID: ${req.params.id}`);
    res.status(204).send();
};

export const getArticulos = async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(ArticuloLaboratorio);
    const items = await repo.find();
    res.json(items);
};

export const createArticulo = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(ArticuloLaboratorio);
    // Asegurar que nombre exista (autogenerado desde marca y modelo si falta)
    if (!req.body.nombre) {
        req.body.nombre = `${req.body.marca || ''} ${req.body.modelo || ''}`.trim() || 'Recurso sin nombre';
    }
    const nuevo = repo.create(req.body);
    const guardado = await repo.save(nuevo) as any;
    await audit(req.user.id, 'CREAR', 'Artículos', `Creado artículo: ${guardado.nombre}`);
    res.status(201).json(guardado);
};

export const updateArticulo = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(ArticuloLaboratorio);
    const item = await repo.findOneBy({ id: parseInt(req.params.id) });
    if (!item) return res.status(404).json({ message: 'Artículo no encontrado' });

    if (!req.body.nombre && (req.body.marca || req.body.modelo)) {
        req.body.nombre = `${req.body.marca || item.marca || ''} ${req.body.modelo || item.modelo || ''}`.trim();
    }

    Object.assign(item, req.body);
    const guardado = await repo.save(item);
    await audit(req.user.id, 'ACTUALIZAR', 'Artículos', `Actualizado artículo ID: ${guardado.id}`);
    res.json(guardado);
};

export const deleteArticulo = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(ArticuloLaboratorio);
    await repo.delete(req.params.id);
    await audit(req.user.id, 'ELIMINAR', 'Artículos', `Eliminado artículo ID: ${req.params.id}`);
    res.status(204).send();
};
