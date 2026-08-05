import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../../src/entities/Usuario';
import { RegistroAuditoria } from '../../src/entities/RegistroAuditoria';
import bcrypt from 'bcryptjs';

const audit = async (usuarioId: number, accion: string, modulo: string, detalles: string) => {
    const repo = AppDataSource.getRepository(RegistroAuditoria);
    await repo.save(repo.create({ usuarioId, accion, modulo, detalles }));
};

export const getUsuarios = async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(Usuario);
    const usuarios = await repo.find();
    const cleanUsers = usuarios.map(({ contrasena, ...user }) => user);
    res.json(cleanUsers);
};

export const createUsuario = async (req: any, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(Usuario);
        const { nombre, nombreCompleto, correo, contrasena, password, rol } = req.body;
        
        const finalPassword = password || contrasena || 'default123';
        const finalName = nombreCompleto || nombre || '';
        
        const hashed = await bcrypt.hash(finalPassword, 10);
        const nuevo = repo.create({ nombre: finalName, correo, contrasena: hashed, rol });
        const guardado = await repo.save(nuevo);
        await audit(req.user.id, 'CREAR', 'Usuarios', `Usuario ${correo} creado.`);
        const { contrasena: _, ...cleanUser } = guardado as any;
        res.status(201).json(cleanUser);
    } catch (error: any) {
        console.error("Error al crear usuario:", error);
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El correo electrónico ya se encuentra registrado.' });
        }
        res.status(500).json({ message: 'Ocurrió un error interno al crear el usuario.' });
    }
};

export const updateUsuario = async (req: any, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(Usuario);
        const item = await repo.findOneBy({ id: parseInt(req.params.id) });
        if (!item) return res.status(404).json({ message: 'No encontrado' });

        const { nombreCompleto, password } = req.body;
        if (nombreCompleto) req.body.nombre = nombreCompleto;
        if (password) {
            req.body.contrasena = await bcrypt.hash(password, 10);
        } else if (req.body.contrasena) {
            req.body.contrasena = await bcrypt.hash(req.body.contrasena, 10);
        }
        
        Object.assign(item, req.body);
        const guardado = await repo.save(item);
        await audit(req.user.id, 'ACTUALIZAR', 'Usuarios', `Usuario ${item.correo} modificado.`);
        res.json(guardado);
    } catch (error: any) {
        console.error("Error al actualizar usuario:", error);
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El correo electrónico ya se encuentra registrado.' });
        }
        res.status(500).json({ message: 'Ocurrió un error interno al actualizar el usuario.' });
    }
};
