# ETAPA 1: Construcción
FROM node:20 AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para el build)
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Compilar el Frontend (Angular)
RUN npm run build

# Compilar el Backend (Express + TypeORM)
RUN npm run build-server

# Limpiar devDependencies de node_modules para dejar solo producción
RUN npm prune --omit=dev --legacy-peer-deps

# ETAPA 2: Ejecución
FROM alpine:latest
WORKDIR /app

# Instalar dependencias del sistema y actualizar para parches de seguridad (cumplimiento DTIC en Alpine)
# Se instala Node.js (sin npm global para evitar vulnerabilidades de herramientas de compilación), postgresql-dev y curl
RUN apk update && apk upgrade && apk add --no-cache \
    nodejs \
    postgresql-dev \
    curl

# Crear un usuario específico para la app (seguridad)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar dependencias de producción preparadas en la etapa de construcción
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/package*.json ./

# Copiar los archivos compilados
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/dist-server ./dist-server

# Dar permisos al usuario no-root
RUN chown -R appuser:appgroup /app

# Cambiar al usuario sin privilegios
USER appuser

# El backend sirve el frontend desde ./dist/sga-fin/browser
EXPOSE 3050

ENV PORT=3050
ENV NODE_ENV=production

CMD ["node", "dist-server/backend/index.js"]