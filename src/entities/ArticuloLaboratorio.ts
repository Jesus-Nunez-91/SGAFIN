import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('articulos_laboratorio')
export class ArticuloLaboratorio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150, nullable: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ length: 100, nullable: true })
    tipoInventario: string;

    @Column({ length: 100, nullable: true })
    categoria: string;

    @Column({ length: 100, nullable: true })
    subCategoria: string;

    @Column({ length: 100, nullable: true })
    rotulo_ID: string;

    @Column({ length: 100, nullable: true })
    marca: string;

    @Column({ length: 100, nullable: true })
    modelo: string;

    @Column({ length: 100, nullable: true })
    sn: string;

    @Column({ length: 100, nullable: true })
    idFisico: string;

    @Column({ length: 100, nullable: true })
    status: string;

    @Column({ length: 100, nullable: true })
    so: string;

    @Column({ length: 100, nullable: true })
    procesador: string;

    @Column({ length: 100, nullable: true })
    ram: string;

    @Column({ length: 100, nullable: true })
    rom: string;

    @Column({ type: 'text', nullable: true })
    softwareInstalado: string;

    @Column({ default: 0 })
    stockActual: number;

    @Column({ default: 0 })
    stockMinimo: number;

    @Column({ default: 0 })
    stockDefectuoso: number;

    @Column({ default: false })
    esFungible: boolean;

    @Column({ type: 'text', nullable: true })
    imagenUrl: string;

    @Column({ length: 100, nullable: true })
    numeroFactura: string;

    @Column({ length: 100, nullable: true })
    fechaLlegada: string;

    @Column({ default: 0 })
    cantidadLlegada: number;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    // Campos antiguos por retrocompatibilidad
    @Column({ length: 100, nullable: true, unique: false })
    numeroSerie: string;

    @Column({ nullable: true })
    laboratorioId: number;

    @Column({ default: 1 })
    stockTotal: number;

    @Column({ default: 1 })
    stockDisponible: number;

    @Column({ default: 'Disponible' })
    estado: string; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
