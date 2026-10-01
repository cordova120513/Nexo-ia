# Multi-stage Dockerfile optimizado para producción con Next.js 16+
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Fase 1: Dependencias
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Fase 2: Construcción (Builder)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivar telemetría de Next.js durante build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Fase 3: Imagen final ligera de Producción (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear usuario y grupo no-root para seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos públicos y el build de Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
