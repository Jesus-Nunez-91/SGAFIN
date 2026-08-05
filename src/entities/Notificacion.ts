import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    usuarioId: string; // 'all' or string id of user

    @Column({ length: 150 })
    titulo: string;

    @Column({ type: 'text' })
    mensaje: string;

    @Column({ length: 20, default: 'info' })
    tipo: string; // 'info', 'warning', 'success', 'error'

    @Column({ default: false })
    leido: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
