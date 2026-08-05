import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('registros_auditoria')
export class RegistroAuditoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuarioId: number;

    @Column({ length: 150 })
    accion: string; // Ej: "CREACION_RESERVA", "ACTUALIZACION_STOCK"

    @Column({ length: 100 })
    modulo: string; // Ej: "Reservas", "Inventario", "Usuarios"

    @Column({ type: 'text', nullable: true })
    detalles: string; // JSON string con detalles de los cambios

    @CreateDateColumn()
    createdAt: Date;
}
