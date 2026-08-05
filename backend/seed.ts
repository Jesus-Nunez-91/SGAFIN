import { AppDataSource } from './data-source';
import { Laboratorio } from '../src/entities/Laboratorio';
import { BloqueHorario } from '../src/entities/BloqueHorario';
import { HorarioAcademico } from '../src/entities/HorarioAcademico';
import { Usuario, RolUsuario } from '../src/entities/Usuario';
import bcrypt from 'bcryptjs';

export const runSeed = async () => {
  console.log("🌱 Iniciando procesos de siembra de base de datos para SGAFIN...");

  try {
    const labRepo = AppDataSource.getRepository(Laboratorio);
    const bloqueRepo = AppDataSource.getRepository(BloqueHorario);
    const horarioRepo = AppDataSource.getRepository(HorarioAcademico);
    const userRepo = AppDataSource.getRepository(Usuario);

    // 1. Crear Laboratorio Central si no existe
    let lab = await labRepo.findOne({ where: { nombre: 'Laboratorio Central' } });
    if (!lab) {
      console.log("🌱 Creando Laboratorio Central...");
      lab = await labRepo.save(labRepo.create({
        nombre: 'Laboratorio Central',
        descripcion: 'Laboratorio principal de ingeniería importado del proyecto antiguo',
        ubicacion: 'Piso Principal',
        capacidad: 40,
        estado: 'Operativo'
      }));
    }

    // 2. Crear Bloques Horarios comunes si no existen
    const bloquesData = [
      { nombre: 'Bloque 1', horaInicio: '08:30:00', horaFin: '09:50:00' },
      { nombre: 'Bloque 2', horaInicio: '10:00:00', horaFin: '11:20:00' },
      { nombre: 'Bloque 3', horaInicio: '11:30:00', horaFin: '12:50:00' },
      { nombre: 'Bloque 4', horaInicio: '13:00:00', horaFin: '14:20:00' },
      { nombre: 'Bloque 5', horaInicio: '14:30:00', horaFin: '15:50:00' },
      { nombre: 'Bloque 6', horaInicio: '16:00:00', horaFin: '17:20:00' },
      { nombre: 'Bloque 7', horaInicio: '17:30:00', horaFin: '18:50:00' }
    ];

    for (const b of bloquesData) {
      const exists = await bloqueRepo.findOne({ where: { horaInicio: b.horaInicio, horaFin: b.horaFin } });
      if (!exists) {
        await bloqueRepo.save(bloqueRepo.create(b));
      }
    }
    // 1.5. Limpiar usuarios docentes autogenerados del seed para mantener la base de datos limpia
    await userRepo.delete({ rol: RolUsuario.DOCENTE });

    // 3. Importar calendario original
    const horarios = await horarioRepo.count();
    if (horarios === 0) {
      console.log("🌱 Importando Malla Académica desde el proyecto original...");
      
      const initialLoans = [
        { className: 'F.Prog sec 02', professor: 'Hector', day: 'Lunes', timeBlock: '10:00 - 11:20' },
        { className: 'F.Prog sec 04', professor: 'Felipe', day: 'Lunes', timeBlock: '13:00 - 14:20' },
        { className: 'Base de Datos sec 02', professor: 'Felipe', day: 'Lunes', timeBlock: '14:30 - 15:50' },
        { className: 'Base de Datos sec 03', professor: 'Guillermo', day: 'Lunes', timeBlock: '16:00 - 17:20' },
        { className: 'Programación Avanzada sec 02', professor: 'FABIO ANTONIO SÁEZ JARA', day: 'Martes', timeBlock: '08:30 - 09:50' },
        { className: 'Programación Avanzada 02', professor: 'FABIO ANTONIO SÁEZ JARA', day: 'Martes', timeBlock: '10:00 - 11:20' },
        { className: 'Ayudantía Redes Sociales sec 01', professor: 'Ayudante', day: 'Martes', timeBlock: '11:30 - 12:50' },
        { className: 'Arte y creatividad en ingeniería Sec 1', professor: 'STEFANI NATALIA MARDONES CARVAJAL', day: 'Martes', timeBlock: '13:00 - 14:20' },
        { className: 'Probabilidad y Estadística sec 01', professor: 'Christopher', day: 'Martes', timeBlock: '16:00 - 17:20' },
        { className: 'F.Prog sec 02', professor: 'Hector', day: 'Miércoles', timeBlock: '10:00 - 11:20' },
        { className: 'Ayudantía Redes', professor: 'Ayudante', day: 'Miércoles', timeBlock: '11:30 - 12:50' },
        { className: 'F.Prog sec 04', professor: 'Felipe', day: 'Miércoles', timeBlock: '13:00 - 14:20' },
        { className: 'Base de Datos sec 02', professor: 'Felipe', day: 'Miércoles', timeBlock: '14:30 - 15:50' },
        { className: 'Base de Datos sec 03', professor: 'Guillermo', day: 'Miércoles', timeBlock: '16:00 - 17:20' },
        { className: 'Redes', professor: 'JUAN ANTONIO SARAVIA VILLAR', day: 'Miércoles', timeBlock: '17:30 - 18:50' },
        { className: 'Ayudantía Programación Avanzada sec 02', professor: 'Ayudante', day: 'Jueves', timeBlock: '11:30 - 12:50' },
        { className: 'Arte y creatividad en ingeniería Sec 1', professor: 'STEFANI NATALIA MARDONES CARVAJAL', day: 'Jueves', timeBlock: '13:00 - 14:20' },
        { className: 'Arte y creatividad en ingeniería Sec 4', professor: 'Claudia Moreno', day: 'Jueves', timeBlock: '16:00 - 17:20' },
        { className: 'Redes', professor: 'JUAN ANTONIO SARAVIA VILLAR', day: 'Jueves', timeBlock: '17:30 - 18:50' },
        { className: 'Arquitectura de software', professor: 'Cristian', day: 'Viernes', timeBlock: '08:30 - 09:50' },
        { className: 'Ayudantía Arquitectura de software', professor: 'Ayudante', day: 'Viernes', timeBlock: '10:00 - 11:20' },
        { className: 'Arquitectura de software', professor: 'Cristian', day: 'Viernes', timeBlock: '11:30 - 12:50' },
        { className: 'Ayudantía redes sociales sec 2', professor: 'Ayudante', day: 'Viernes', timeBlock: '13:00 - 14:20' },
        { className: 'Ayudantía Base de Datos sec 02', professor: 'Ayudante', day: 'Viernes', timeBlock: '14:30 - 15:50' },
        { className: 'F.Prog sec 09', professor: 'Sin profesor', day: 'Viernes', timeBlock: '16:00 - 17:20' }
      ];

      for (const item of initialLoans) {
        // Encontrar bloque usando la hora de inicio
        const startTime = item.timeBlock.split(' - ')[0] + ':00';
        let bloque = await bloqueRepo.findOne({ where: { horaInicio: startTime } });

        // Guardar el bloque en Horario Academico sin crear el docente como usuario
        await horarioRepo.save(horarioRepo.create({
          laboratorioId: lab.id,
          docenteId: null,
          asignatura: item.className,
          diaSemana: item.day,
          bloqueId: bloque ? bloque.id : 1, // Fallback al bloque 1 si no encuentra
          semestre: '1',
          anio: 2026
        }));
      }
      
      console.log("✅ Malla académica importada correctamente desde el sistema antiguo.");
    }
    
  } catch (error) {
    console.error("⚠️ Error durante el proceso de siembra:", error);
  }
};
