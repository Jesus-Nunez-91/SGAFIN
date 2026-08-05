import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RolUsuario {
    ALUMNO = 'Alumno',
    DOCENTE = 'Docente',
    ENCARGADO_LABORATORIO = 'Encargado Laboratorio',
    ADMINISTRADOR = 'Administrador'
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ unique: true, length: 100 })
    correo: string;

    @Column()
    contrasena: string;

    @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.ALUMNO })
    rol: RolUsuario;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
