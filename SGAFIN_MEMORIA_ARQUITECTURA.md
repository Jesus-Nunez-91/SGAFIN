# SGAFIN - Memoria de Arquitectura y Contexto (Versión 1.0 - Base)

> **NOTA PARA EL AGENTE DE IA (TÚ EN EL FUTURO):**  
> Si estás leyendo esto al iniciar una nueva conversación, asume inmediatamente el rol de Ingeniero de Software Principal para el proyecto SGAFIN. Tu objetivo es continuar extrayendo módulos del monolito antiguo (`sgaproactualizado`) e integrándolos progresivamente en este nuevo proyecto moderno (`SGAFIN`), siguiendo estrictamente las reglas definidas abajo.

## 1. Contexto del Proyecto
El proyecto original (`sgaproactualizado`) era un monolito gigante con código muerto y vistas mezcladas. Para poder entregar una versión limpia a **TICS** (Departamento de TI) y ponerla en marcha, extrajimos el "Core" del sistema y creamos **SGAFIN** (Sistema de Gestión de Activos Físicos e Infraestructura).

En el futuro (Ej: Verano 2027), se irán agregando los módulos faltantes (Mantenimiento, Compras, Wiki, etc.) mediante actualizaciones progresivas, extrayéndolos del proyecto viejo y adaptándolos a esta nueva arquitectura.

## 2. Arquitectura Establecida (Lo que ya construimos)
El sistema actual es completamente funcional, tipado, libre de errores y usa las siguientes tecnologías:

### Backend (Node.js + Express + TypeORM + PostgreSQL)
- **Puerto:** `3050`
- **Autenticación:** JWT con roles y cifrado de contraseñas mediante `bcryptjs`.
- **Estructura:**
  - `src/entities/`: Entidades estrictas en español (`Usuario`, `Laboratorio`, `ArticuloLaboratorio`, `BloqueHorario`, `HorarioAcademico`, `Reserva`, `Solicitud`, `RegistroAuditoria`, `Notificacion`).
  - `backend/controllers/`: Controladores segregados por entidad (`reservas.controlador.ts`, `laboratorios.controlador.ts`, etc.).
  - `backend/routes/`: Rutas modulares agrupadas en `backend/index.ts` bajo `/api/...`.
  - **Auditoría Automática:** Cualquier acción (crear, editar, eliminar) guarda un log en `RegistroAuditoria`.

### Lógica de Negocio Crítica Implementada
- **Reservas de 7 días:** Si el rol es `Alumno` o `Docente`, el backend y frontend bloquean reservas con menos de 7 días de antelación.
- **Bloques Horarios Estáticos:** Las reservas se hacen en base a "Bloques" (Ej: 08:00 a 09:30). Si un equipo o laboratorio se reserva en el "Bloque 1", queda libre para el "Bloque 2". No hay conflictos de horas.

### Frontend (Angular + TailwindCSS)
- **Puerto:** `3030`
- **Diseño:** Moderno, estético, utilizando *Glassmorphism* (fondos con blur, transparencias, gradientes vivos, modo oscuro nativo).
- **Servicio Central:** `src/services/data.service.ts` maneja todas las llamadas HTTP (usando `fetch`) y almacena el estado global usando Angular Signals (`signal<T>`). No tiene código muerto.
- **Vistas Principales (`src/pages/`):**
  - `inicio-sesion.componente.ts`
  - `panel-principal.componente.ts` (Dashboard dinámico por rol)
  - `laboratorios.componente.ts` (Inventario)
  - `reservas.componente.ts` (Gestión de reservas con restricción de calendario)
  - `horario-academico.componente.ts`
  - `solicitudes.componente.ts`
  - `usuarios.componente.ts` y `auditoria.componente.ts` (Solo Admins)

## 3. Protocolo para Integrar Nuevos Módulos (Futuras Actualizaciones)
Cuando el usuario solicite extraer un nuevo módulo del proyecto viejo (`sgaproactualizado`) hacia `SGAFIN`, debes seguir este protocolo estricto:

1. **Analizar el módulo viejo:** Revisa las entidades y vistas en `sgaproactualizado` correspondientes al módulo (ej. Mantenimiento).
2. **Crear Entidades en Español:** Traduce o adapta las entidades a TypeORM en `SGAFIN/src/entities/`.
3. **Controladores y Rutas:** Escribe controladores limpios en `SGAFIN/backend/controllers/` que respeten el middleware de roles (`authMiddleware`). NO copies código viejo directamente; reescríbelo siguiendo la nueva convención.
4. **DataService:** Añade las nuevas Interfaces y métodos `fetch` al `SGAFIN/src/services/data.service.ts` usando Signals.
5. **Vistas Angular:** Crea los componentes en `SGAFIN/src/pages/` usando **TailwindCSS puro y Glassmorphism**. ¡Nunca uses estilos genéricos, debe verse premium!
6. **Compilación:** Antes de finalizar, asegúrate de correr `npm run build:full` para verificar que el frontend y el backend no tengan errores de TypeScript.

## 4. Políticas de Seguridad (Zero Trust)
Es estrictamente mandatorio que todo el código fuente mantenga una política de confianza cero (Zero Trust) respecto a secretos y credenciales:
- **Cero Credenciales Hardcodeadas:** Bajo ninguna circunstancia puedes escribir contraseñas (ej. `123456`, `admin123`), llaves maestras, secretos JWT o tokens de APIs directamente en el código fuente o en funciones de *fallback*.
- **Uso estricto del `.env`:** Todas las contraseñas, secretos y variables críticas deben obtenerse **obligatoriamente** desde `process.env`.
- **Fallo Seguro (Fail-Safe):** Si una variable crítica del entorno (como `JWT_SECRET` o `ADMIN_DEFAULT_PASSWORD`) no existe, el servidor o componente debe bloquearse/lanzar error inmediatamente en lugar de usar un string genérico de respaldo.
- **Limpieza de Logs:** Nunca imprimas contraseñas reales ni las retornes en mensajes de error o logs de la consola.
