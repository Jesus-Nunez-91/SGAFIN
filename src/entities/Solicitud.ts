import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoSolicitud {
    PENDIENTE = 'Pendiente',
    EN_PROGRESO = 'En Progreso',
    RESUELTA = 'Resuelta',
    RECHAZADA = 'Rechazada'
}

@Entity('solicitudes')
export class Solicitud {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuarioId: number;

    @Column({ length: 100 })
    tipoSolicitud: string; // ej: "Instalación de Software", "Soporte Técnico"

    @Column({ type: 'text' })
    descripcion: string;

    @Column({ type: 'enum', enum: EstadoSolicitud, default: EstadoSolicitud.PENDIENTE })
    estado: EstadoSolicitud;

    @Column({ type: 'text', nullable: true })
    respuestaAdmin: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
