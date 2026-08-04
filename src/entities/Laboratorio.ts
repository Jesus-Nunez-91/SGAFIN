import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('laboratorios')
export class Laboratorio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ length: 100, nullable: true })
    ubicacion: string;

    @Column({ default: 0 })
    capacidad: number;

    @Column({ default: 'Operativo' })
    estado: string; // Operativo, En Mantenimiento, Inactivo

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
