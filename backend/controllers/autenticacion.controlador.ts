import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../../src/entities/Usuario';
import { RegistroAuditoria } from '../../src/entities/RegistroAuditoria';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response) => {
    try {
        const { correo, contrasena } = req.body;
        const userRepo = AppDataSource.getRepository(Usuario);
        
        const user = await userRepo.findOne({ where: { correo } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        if (!user.activo) {
            return res.status(401).json({ message: 'Usuario inactivo o suspendido' });
        }

        const isValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        if (user.pendienteAprobacion && user.rol !== 'SuperUser') {
            return res.status(403).json({ message: 'Tu cuenta está pendiente de aprobación por el Administrador.', pendienteAprobacion: true });
        }

        if (!JWT_SECRET) return res.status(500).json({ msg: 'Falta JWT_SECRET' });
        const token = jwt.sign(
            { id: user.id, correo: user.correo, rol: user.rol, nombre: user.nombre },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Audit log
        const auditRepo = AppDataSource.getRepository(RegistroAuditoria);
        await auditRepo.save(auditRepo.create({
            usuarioId: user.id,
            accion: 'LOGIN',
            modulo: 'Autenticación',
            detalles: 'Inicio de sesión exitoso'
        }));

        if (user.primerIngreso && user.rol !== 'SuperUser') {
            return res.json({ requierePersonalizacion: true, token, user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol } });
        }

        res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol } });
    } catch (error: any) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const userRepo = AppDataSource.getRepository(Usuario);
        const { nombre, correo, contrasena, rol } = req.body;

        const existing = await userRepo.findOne({ where: { correo } });
        if (existing) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashed = await bcrypt.hash(contrasena, 10);
        const newUser = userRepo.create({
            nombre,
            correo,
            contrasena: hashed,
            rol: rol || 'Alumno'
        });

        await userRepo.save(newUser);

        // Audit log
        const auditRepo = AppDataSource.getRepository(RegistroAuditoria);
        await auditRepo.save(auditRepo.create({
            usuarioId: newUser.id,
            accion: 'REGISTER',
            modulo: 'Autenticación',
            detalles: `Registro de nuevo usuario: ${correo}`
        }));

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const getMe = async (req: any, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }
    res.json(req.user);
};
