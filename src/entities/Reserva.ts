import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoReserva {
    LABORATORIO = 'Laboratorio',
    ARTICULO = 'Articulo'
}

export enum EstadoReserva {
    PENDIENTE = 'Pendiente',
    APROBADA = 'Aprobada',
    RECHAZADA = 'Rechazada',
    CANCELADA = 'Cancelada'
}

@Entity('reservas')
export class Reserva {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: TipoReserva, default: TipoReserva.ARTICULO })
    tipoReserva: TipoReserva;

    @Column({ nullable: true })
    laboratorioId: number;

    @Column({ nullable: true })
    articuloId: number;

    @Column({ nullable: true })
    equipoId: number;

    @Column({ nullable: true })
    usuarioId: number;

    @Column({ nullable: true })
    bloqueId: number;

    @Column({ type: 'date', nullable: true })
    fechaReserva: string;

    @Column({ length: 50, nullable: true })
    fecha: string;

    @Column({ length: 50, nullable: true })
    bloque: string;

    @Column({ default: 1 })
    cantidad: number;

    @Column({ length: 150, nullable: true })
    nombreSolicitante: string;

    @Column({ length: 50, nullable: true })
    rutSolicitante: string;

    @Column({ length: 150, nullable: true })
    emailSolicitante: string;

    @Column({ length: 50, nullable: true })
    tipoUsuario: string;

    @Column({ default: false })
    aprobada: boolean;

    @Column({ default: false })
    rechazada: boolean;

    @Column({ type: 'text', nullable: true })
    motivoRechazo: string;

    @Column({ default: 0 })
    devuelto: number;

    @Column({ length: 50, nullable: true })
    tipoItem: string;

    @Column({ length: 255, nullable: true })
    detalle: string;

    @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.PENDIENTE })
    estado: EstadoReserva;

    @Column({ type: 'text', nullable: true })
    motivo: string;

    @Column({ type: 'text', nullable: true })
    notasAdmin: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
