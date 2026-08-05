import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bloques_horarios')
export class BloqueHorario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    nombre: string; // ej: "Bloque 1"

    @Column({ type: 'time' })
    horaInicio: string;

    @Column({ type: 'time' })
    horaFin: string;
}
