import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('horarios_academicos')
export class HorarioAcademico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: true })
    lab: string;

    @Column({ length: 50, nullable: true })
    day: string;

    @Column({ length: 50, nullable: true })
    block: string;

    @Column({ length: 255, nullable: true })
    subject: string;

    @Column({ length: 30, nullable: true })
    color: string;

    @Column({ nullable: true })
    laboratorioId: number;

    @Column({ nullable: true })
    docenteId: number;

    @Column({ length: 150, nullable: true })
    asignatura: string;

    @Column({ length: 20, nullable: true })
    diaSemana: string;

    @Column({ nullable: true })
    bloqueId: number;

    @Column({ length: 20, nullable: true })
    semestre: string;

    @Column({ nullable: true })
    anio: number;

    @CreateDateColumn()
    createdAt: Date;
}
