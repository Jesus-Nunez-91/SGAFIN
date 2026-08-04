import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../src/entities/Usuario";
import { Laboratorio } from "../src/entities/Laboratorio";
import { ArticuloLaboratorio } from "../src/entities/ArticuloLaboratorio";
import { BloqueHorario } from "../src/entities/BloqueHorario";
import { HorarioAcademico } from "../src/entities/HorarioAcademico";
import { Reserva } from "../src/entities/Reserva";
import { Solicitud } from "../src/entities/Solicitud";
import { RegistroAuditoria } from "../src/entities/RegistroAuditoria";
import { Notificacion } from "../src/entities/Notificacion";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        Usuario, Laboratorio, ArticuloLaboratorio, BloqueHorario, 
        HorarioAcademico, Reserva, Solicitud, RegistroAuditoria, Notificacion
    ],
    migrations: [],
    subscribers: [],
});
