import express from 'express';
import cors from 'cors';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import authRoutes from './routes/autenticacion.rutas';
import usuariosRoutes from './routes/usuarios.rutas';
import auditoriaRoutes from './routes/auditoria.rutas';
import laboratoriosRoutes from './routes/laboratorios.rutas';
import horarioRoutes from './routes/horario-academico.rutas';
import reservasRoutes from './routes/reservas.rutas';
import solicitudesRoutes from './routes/solicitudes.rutas';
import { initSocket } from './socket';
import { Usuario, RolUsuario } from '../src/entities/Usuario';
import bcrypt from 'bcryptjs';
import { runSeed } from './seed';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/laboratorios', laboratoriosRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

// --- SERVIR FRONTEND ---
// Angular 17+ application builder genera la salida en la carpeta "browser"
const publicPath = path.join(process.cwd(), 'dist/sga-fin/browser');
const fallbackPath = fs.existsSync(publicPath) ? publicPath : path.join(process.cwd(), 'dist/sga-fin');

app.use(express.static(fallbackPath));

// Fallback para SPA (Cualquier ruta no manejada por API va al index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(fallbackPath, 'index.html'));
});

let serverInstance: any;
let finalServer: any;
const sslPath = path.join(__dirname, 'ssl');
const hasCert = fs.existsSync(path.join(sslPath, 'cert.pem')) && fs.existsSync(path.join(sslPath, 'key.pem'));

if (hasCert) {
    const options = {
        key: fs.readFileSync(path.join(sslPath, 'key.pem')),
        cert: fs.readFileSync(path.join(sslPath, 'cert.pem')),
    };
    serverInstance = createHttpsServer(options, app);
    finalServer = serverInstance;
    console.log(`🛡️  Servidor HTTPS habilitado.`);
} else {
    serverInstance = createHttpServer(app);
    finalServer = serverInstance;
    console.log(`⚠️  Servidor corriendo en HTTP (Certificados no encontrados en backend/ssl/)`);
}

initSocket(serverInstance);

const PORT = process.env.PORT || 3050;

AppDataSource.initialize().then(async () => {
    console.log("Conectado a la base de datos PostgreSQL SGAFIN");

    // Inicialización oculta de seguridad (Creación de SuperAdmin automático)
    try {
        const userRepo = AppDataSource.getRepository(Usuario);
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@uah.cl';
        const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
        const adminExists = await userRepo.findOne({ where: { correo: adminEmail } });
        if (!adminExists) {
            const hash = await bcrypt.hash(adminPass, 10);
            await userRepo.save({
                nombre: 'Super Administrador (Oculto)',
                correo: adminEmail,
                contrasena: hash,
                rol: RolUsuario.ADMINISTRADOR
            });
        }
    } catch (e) {
        // Fallo silencioso por seguridad
    }

    // Ejecutar semilla de datos base
    await runSeed();

    finalServer.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT} (${hasCert ? 'HTTPS+HTTP' : 'HTTP'})`);
    });
}).catch(error => console.log("Error de conexión a la BD:", error));
