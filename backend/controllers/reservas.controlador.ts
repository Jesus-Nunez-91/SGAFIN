import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Reserva, EstadoReserva } from '../../src/entities/Reserva';
import { RegistroAuditoria } from '../../src/entities/RegistroAuditoria';

const audit = async (usuarioId: number, accion: string, modulo: string, detalles: string) => {
    const repo = AppDataSource.getRepository(RegistroAuditoria);
    await repo.save(repo.create({ usuarioId, accion, modulo, detalles }));
};

export const getReservas = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Reserva);
    const userRole = req.user?.rol || '';
    const isAdmin = ['Admin_Labs', 'SuperUser', 'Administrador', 'Encargado Laboratorio', 'Admin_Acade'].includes(userRole);
    
    const filter = isAdmin ? {} : { usuarioId: req.user.id };
    
    let items = await repo.find({ where: filter, order: { createdAt: 'DESC' } });

    // Normalizar estructura para el frontend
    const normalized = items.map((r: any) => ({
        ...r,
        aprobada: Boolean(r.aprobada || r.estado === EstadoReserva.APROBADA),
        rechazada: Boolean(r.rechazada || r.estado === EstadoReserva.RECHAZADA),
        motivoRechazo: r.motivoRechazo || r.notasAdmin || r.motivo || '',
        fecha: r.fecha || r.fechaReserva,
        bloque: r.bloque || '08:30 - 09:50',
        equipoId: r.equipoId || r.articuloId
    }));

    res.json(normalized);
};

export const createReserva = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Reserva);
    const { id, equipoId, fecha, bloque, cantidad, nombreSolicitante, rutSolicitante, emailSolicitante, tipoUsuario, ...otherProps } = req.body;
    
    const nueva = repo.create({
        ...otherProps,
        equipoId: equipoId || req.body.articuloId,
        fecha: fecha || req.body.fechaReserva,
        fechaReserva: fecha || req.body.fechaReserva || new Date().toISOString().split('T')[0],
        bloque: bloque || '08:30 - 09:50',
        cantidad: cantidad || 1,
        nombreSolicitante: nombreSolicitante || req.user.nombreCompleto || req.user.correo,
        rutSolicitante: rutSolicitante || req.user.rut || '12345678-9',
        emailSolicitante: emailSolicitante || req.user.correo,
        tipoUsuario: tipoUsuario || req.user.rol,
        usuarioId: req.user.id,
        aprobada: false,
        rechazada: false,
        estado: EstadoReserva.PENDIENTE
    });
    
    const guardada: any = await repo.save(nueva);
    await audit(req.user.id, 'CREAR', 'Reservas', `Reserva ID: ${guardada.id} creada para fecha: ${(nueva as any).fecha}`);
    res.status(201).json(guardada);
};

export const updateReservaStatus = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Reserva);
    const item = await repo.findOneBy({ id: parseInt(req.params.id) });
    if (!item) return res.status(404).json({ message: 'No encontrado' });

    if (req.body.aprobada !== undefined) item.aprobada = req.body.aprobada;
    if (req.body.rechazada !== undefined) item.rechazada = req.body.rechazada;
    if (req.body.motivoRechazo !== undefined) {
        item.motivoRechazo = req.body.motivoRechazo;
        item.notasAdmin = req.body.motivoRechazo;
    }

    if (req.body.aprobada) item.estado = EstadoReserva.APROBADA;
    if (req.body.rechazada) item.estado = EstadoReserva.RECHAZADA;
    if (req.body.devuelto !== undefined) item.devuelto = req.body.devuelto;
    
    const guardado = await repo.save(item);
    await audit(req.user.id, 'ACTUALIZAR', 'Reservas', `Estado de Reserva ${item.id} actualizado a ${item.estado}`);
    res.json(guardado);
};

export const deleteReserva = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(Reserva);
    await repo.delete(req.params.id);
    await audit(req.user.id, 'ELIMINAR', 'Reservas', `Reserva ID ${req.params.id} eliminada`);
    res.status(204).send();
};
