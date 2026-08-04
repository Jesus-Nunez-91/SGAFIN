import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { RegistroAuditoria } from '../../src/entities/RegistroAuditoria';

export const getAuditoria = async (req: Request, res: Response) => {
    const repo = AppDataSource.getRepository(RegistroAuditoria);
    const logs = await repo.find({ order: { createdAt: 'DESC' }, take: 100 });
    res.json(logs);
};
