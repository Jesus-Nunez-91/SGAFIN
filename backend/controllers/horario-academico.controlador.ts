import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { HorarioAcademico } from '../../src/entities/HorarioAcademico';
import { BloqueHorario } from '../../src/entities/BloqueHorario';
import { RegistroAuditoria } from '../../src/entities/RegistroAuditoria';

const audit = async (usuarioId: number, accion: string, modulo: string, detalles: string) => {
    const repo = AppDataSource.getRepository(RegistroAuditoria);
    await repo.save(repo.create({ usuarioId, accion, modulo, detalles }));
};

const initialSchedules = [
    // FABLAB
    { lab: 'FABLAB', day: 'Lunes', block: '11:30 - 12:50', subject: '# LAB ELECTROMAGNETISMO SEC 1', color: '#ec4899' },
    { lab: 'FABLAB', day: 'Martes', block: '10:00 - 11:20', subject: '# ELECTIVO DE ESPECIALIDAD INDUSTRIAL (FABLAB) SEC 3', color: '#ec4899' },
    { lab: 'FABLAB', day: 'Martes', block: '11:30 - 12:50', subject: '# ELECTIVO DE ESPECIALIDAD INDUSTRIAL (FABLAB) SEC 4', color: '#0284c7' },
    { lab: 'FABLAB', day: 'Martes', block: '14:30 - 15:50', subject: '# OPTATIVO FORMACIÓN COMPLEM II IND (FABLAB)', color: '#ec4899' },
    { lab: 'FABLAB', day: 'Miércoles', block: '11:30 - 12:50', subject: '# LAB ELECTROMAGNETISMO SEC 2', color: '#ec4899' },
    { lab: 'FABLAB', day: 'Jueves', block: '10:00 - 11:20', subject: '# ELECTIVO DE ESPECIALIDAD INDUSTRIAL (FABLAB) SEC 3', color: '#ec4899' },
    { lab: 'FABLAB', day: 'Jueves', block: '11:30 - 12:50', subject: '# ELECTIVO DE ESPECIALIDAD INDUSTRIAL (FABLAB) SEC 4', color: '#0284c7' },
    { lab: 'FABLAB', day: 'Jueves', block: '14:30 - 15:50', subject: '# OPTATIVO FORMACIÓN COMPLEM II IND (FABLAB)', color: '#ec4899' },
    { lab: 'FABLAB', day: 'Jueves', block: '17:30 - 18:50', subject: '# AYUDANTIA CIENCIA DE DATOS (DT)', color: '#ec4899' },
    { lab: 'FABLAB', day: 'Viernes', block: '11:30 - 12:50', subject: '# LAB ELECTROMAGNETISMO SEC 3', color: '#ec4899' },

    // HACKERLAB
    { lab: 'HACKERLAB', day: 'Lunes', block: '13:00 - 14:20', subject: 'ALGEBRA LINEAL USO DE PCS', color: '#16a34a' },
    { lab: 'HACKERLAB', day: 'Lunes', block: '14:30 - 15:50', subject: 'EDO HORARIO USO DE PCS', color: '#0284c7' },
    { lab: 'HACKERLAB', day: 'Martes', block: '10:00 - 11:20', subject: '# ELECTIVO DE ESPECIALIDAD INFORMÁTICA (HACKERLAB) SEC 1', color: '#16a34a' },
    { lab: 'HACKERLAB', day: 'Martes', block: '11:30 - 12:50', subject: '# ELECTIVO DE ESPECIALIDAD INFORMÁTICA (HACKERLAB) SEC 2', color: '#0284c7' },
    { lab: 'HACKERLAB', day: 'Martes', block: '14:30 - 15:50', subject: '# OPT FORM COMPLEMENTARIA II--> EXPERIENCIA DE USUARIO (HACKERLAB)', color: '#ec4899' },
    { lab: 'HACKERLAB', day: 'Martes', block: '16:00 - 17:20', subject: '# FUND. DE CIENCIA DE DATOS (HACKERLAB) SEC 1', color: '#ec4899' },
    { lab: 'HACKERLAB', day: 'Miércoles', block: '13:00 - 14:20', subject: 'ALGEBRA LINEAL USO DE PCS', color: '#16a34a' },
    { lab: 'HACKERLAB', day: 'Miércoles', block: '14:30 - 15:50', subject: 'EDO HORARIO USO DE PCS', color: '#0284c7' },
    { lab: 'HACKERLAB', day: 'Jueves', block: '10:00 - 11:20', subject: '# ELECTIVO DE ESPECIALIDAD INFORMÁTICA (HACKERLAB) SEC 1', color: '#ec4899' },
    { lab: 'HACKERLAB', day: 'Jueves', block: '11:30 - 12:50', subject: '# ELECTIVO DE ESPECIALIDAD INFORMÁTICA (HACKERLAB) SEC 2', color: '#0284c7' },
    { lab: 'HACKERLAB', day: 'Jueves', block: '14:30 - 15:50', subject: '# OPT FORM COMPLEMENTARIA II--> EXPERIENCIA DE USUARIO (HACKERLAB)', color: '#ec4899' },
    { lab: 'HACKERLAB', day: 'Jueves', block: '16:00 - 17:20', subject: '# FUND. DE CIENCIA DE DATOS (HACKERLAB) SEC 1', color: '#ec4899' },
    { lab: 'HACKERLAB', day: 'Viernes', block: '13:00 - 14:20', subject: 'ALGEBRA LINEAL USO DE PCS', color: '#16a34a' },
    { lab: 'HACKERLAB', day: 'Viernes', block: '14:30 - 15:50', subject: 'EDO HORARIO USO DE PCS', color: '#0284c7' },

    // DESARROLLO TECNOLOGICO
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Lunes', block: '08:30 - 09:50', subject: '# SISTEMAS OPERATIVOS (DT) SEC 1', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Lunes', block: '10:00 - 11:20', subject: '# SISTEMAS OPERATIVOS (DT) SEC 1', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Lunes', block: '13:00 - 14:20', subject: '# AYUDANTIA SISTEMAS OPERATIVOS SEC 2 (DT)', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Lunes', block: '17:30 - 18:50', subject: '# ENTORNO JURÍDICO DE LOS NEG (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Martes', block: '08:30 - 09:50', subject: '# AYUDANTIA CIBERSEGURIDAD (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Martes', block: '10:00 - 11:20', subject: '# CAPSTONE (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Martes', block: '11:30 - 12:50', subject: '# CAPSTONE (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Martes', block: '13:00 - 14:20', subject: '# INGENIERÍA DE SOFTWARE (DT) SEC 1', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Martes', block: '14:30 - 15:50', subject: '# INGENIERÍA DE SOFTWARE (DT) SEC 1', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Martes', block: '16:00 - 17:20', subject: '# AYUDANTIA SISTEMAS OPERATIVOS SEC 1(DT)', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Martes', block: '17:30 - 18:50', subject: '# ENTORNO JURÍDICO DE LOS NEG (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Miércoles', block: '13:00 - 14:20', subject: '# AYUDANTIA INGENIERÍA DE SOFTWARE (DT) SEC 2', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Miércoles', block: '14:30 - 15:50', subject: '# SISTEMAS OPERATIVOS (DT) SEC 2', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Miércoles', block: '16:00 - 17:20', subject: '# SISTEMAS OPERATIVOS (DT) SEC 2', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Miércoles', block: '17:30 - 18:50', subject: '# TRANSFORMACIÓN DIGITAL (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Jueves', block: '08:30 - 09:50', subject: '# AYUDANTIA INGENIERÍA DE SOFTWARE (DT) SEC 1', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Jueves', block: '10:00 - 11:20', subject: '# CIBERSEGURIDAD (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Jueves', block: '11:30 - 12:50', subject: '# CIBERSEGURIDAD (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Jueves', block: '13:00 - 14:20', subject: '# INGENIERÍA DE SOFTWARE (DT) SEC 2', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Jueves', block: '14:30 - 15:50', subject: '# INGENIERÍA DE SOFTWARE (DT) SEC 2', color: '#ea580c' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Jueves', block: '17:30 - 18:50', subject: '# TRANSFORMACIÓN DIGITAL (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Viernes', block: '10:00 - 11:20', subject: '# ORG INDUS PARA INDUSTRIA 4.0 (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Viernes', block: '11:30 - 12:50', subject: '# ORG INDUS PARA INDUSTRIA 4.0 (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Viernes', block: '13:00 - 14:20', subject: '# FORMULACIÓN Y EVAL PROYECTOS (DT)', color: '#ec4899' },
    { lab: 'DESARROLLO TECNOLOGICO', day: 'Viernes', block: '14:30 - 15:50', subject: '# FORMULACIÓN Y EVAL PROYECTOS (DT)', color: '#ec4899' },

    // FISICA
    { lab: 'FISICA', day: 'Lunes', block: '10:00 - 11:20', subject: '# LABORATORIO FÍSICA II', color: '#ec4899' },
    { lab: 'FISICA', day: 'Lunes', block: '11:30 - 12:50', subject: '# LAB ELECTROMAGNETISMO SEC 1', color: '#ec4899' },
    { lab: 'FISICA', day: 'Miércoles', block: '08:30 - 09:50', subject: '# Física I Sec 5 (lab)', color: '#16a34a' },
    { lab: 'FISICA', day: 'Miércoles', block: '10:00 - 11:20', subject: '# Física I Sec1 (lab)', color: '#16a34a' },
    { lab: 'FISICA', day: 'Miércoles', block: '11:30 - 12:50', subject: '# LAB ELECTROMAGNETISMO SEC 2', color: '#ec4899' },
    { lab: 'FISICA', day: 'Miércoles', block: '13:00 - 14:20', subject: '# Física I Sec3 (lab)', color: '#16a34a' },
    { lab: 'FISICA', day: 'Viernes', block: '08:30 - 09:50', subject: '# Física I Sec 6 (lab)', color: '#16a34a' },
    { lab: 'FISICA', day: 'Viernes', block: '10:00 - 11:20', subject: '# Física I Sec2 (lab)', color: '#16a34a' },
    { lab: 'FISICA', day: 'Viernes', block: '11:30 - 12:50', subject: '# LAB ELECTROMAGNETISMO SEC 3', color: '#ec4899' },
    { lab: 'FISICA', day: 'Viernes', block: '13:00 - 14:20', subject: '# Física I Sec4 (lab)', color: '#16a34a' },

    // QUIMICA
    { lab: 'QUIMICA', day: 'Martes', block: '10:00 - 11:20', subject: '# Sostenibilidad II Sec3 lab', color: '#16a34a' },
    { lab: 'QUIMICA', day: 'Martes', block: '13:00 - 14:20', subject: '# Sostenibilidad II Sec1 lab', color: '#16a34a' },
    { lab: 'QUIMICA', day: 'Martes', block: '16:00 - 17:20', subject: '# Sostenibilidad II Sec5 lab', color: '#16a34a' },
    { lab: 'QUIMICA', day: 'Jueves', block: '10:00 - 11:20', subject: '# Sostenibilidad II Sec4 lab', color: '#16a34a' },
    { lab: 'QUIMICA', day: 'Jueves', block: '13:00 - 14:20', subject: '# Sostenibilidad II Sec2 lab', color: '#16a34a' },
    { lab: 'QUIMICA', day: 'Jueves', block: '16:00 - 17:20', subject: '# Sostenibilidad II Sec6 lab', color: '#16a34a' }
];

export const getBloques = async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(BloqueHorario);
    const bloques = await repo.find();
    res.json(bloques);
};

export const createBloque = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(BloqueHorario);
    const nuevo = repo.create(req.body);
    const guardado = await repo.save(nuevo) as any;
    await audit(req.user.id, 'CREAR', 'BloqueHorario', `Creado bloque: ${guardado.nombre}`);
    res.status(201).json(guardado);
};

export const getHorarios = async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(HorarioAcademico);
    let horarios = await repo.find();
    
    // Si la BD está completamente vacía, poblamos con los iniciales una sola vez
    if (horarios.length === 0) {
        for (const init of initialSchedules) {
            await repo.save(repo.create(init));
        }
        horarios = await repo.find();
    }
    res.json(horarios);
};

export const createHorario = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(HorarioAcademico);
    const { lab, day, block, subject, color } = req.body;

    if (lab && day && block) {
        const existente = await repo.findOne({ where: { lab, day, block } });
        if (existente) {
            existente.subject = subject;
            if (color) existente.color = color;
            const guardado = await repo.save(existente);
            return res.json(guardado);
        }
    }

    const nuevo = repo.create(req.body);
    const guardado = await repo.save(nuevo) as any;
    await audit(req.user.id, 'CREAR', 'HorarioAcademico', `Asignatura: ${guardado.subject || guardado.asignatura}`);
    res.status(201).json(guardado);
};

export const deleteHorario = async (req: any, res: Response) => {
    const repo = AppDataSource.getRepository(HorarioAcademico);
    await repo.delete(req.params.id);
    await audit(req.user.id, 'ELIMINAR', 'HorarioAcademico', `ID eliminado: ${req.params.id}`);
    res.status(204).send();
};
