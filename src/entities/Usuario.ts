import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RolUsuario {
    ALUMNO = 'Alumno',
    DOCENTE = 'Docente',
    ADMIN_ACADE = 'Admin_Acade',
    ADMIN_LABS = 'Admin_Labs',
    SUPERUSER = 'SuperUser'
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

    @Column({ nullable: true, length: 15 })
    rut: string;

    @Column({ nullable: true, length: 100 })
    carrera: string;

    @Column({ nullable: true, type: 'int' })
    anioIngreso: number;

    @Column({ default: true })
    primerIngreso: boolean;

    @Column({ default: false })
    pendienteAprobacion: boolean;

    @Column({ default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
