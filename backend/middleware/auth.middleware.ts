import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RolUsuario } from '../../src/entities/Usuario';

const JWT_SECRET = process.env.JWT_SECRET;

export const ROLES = {
    ADMIN: RolUsuario.ADMINISTRADOR,
    LAB_ADMIN: RolUsuario.ENCARGADO_LABORATORIO,
    DOCENTE: RolUsuario.DOCENTE,
    ALUMNO: RolUsuario.ALUMNO
};

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    try {
        if (!JWT_SECRET) return res.status(500).json({ msg: 'Servidor no configurado correctamente.' });
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

export const checkPermission = (rolesPermitidos: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }
        next();
    };
};
