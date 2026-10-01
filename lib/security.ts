import { z } from "zod";

/**
 * Sanitiza cadenas de texto para prevenir ataques XSS (Cross-Site Scripting),
 * inyecciones de código y neutralizar etiquetas HTML como <script>, <iframe>, <object>, etc.
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input || typeof input !== "string") return "";
  
  return input
    // Neutralizar protocolos ejecutables
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .replace(/vbscript:/gi, "")
    // Eliminar etiquetas ejecutables comunes y sus contenidos
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    // Eliminar manejadores de eventos inline (onerror, onclick, onload, etc.)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^>\s]+/gi, "")
    // Eliminar cualquier etiqueta HTML remanente
    .replace(/<[^>]*>?/gm, "")
    // Escapar caracteres clave de entidades HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Desescapa entidades básicas si se requiere desplegar texto plano seguro
 */
export function unescapeSafe(text: string): string {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/**
 * Rate Limiter en memoria para rutas API de Next.js
 * Permite limitar peticiones abusivas o ataques de fuerza bruta por IP o clave
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Limpieza periódica de registros viejos si la memoria crece
  if (rateLimitStore.size > 5000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Esquemas Zod para validación estricta de formularios y modelos
 */
export const ProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(120),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  costo: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  stockMinimo: z.number().int().nonnegative().optional(),
  categoria: z.string().max(60).optional(),
  proveedor: z.string().max(80).optional(),
  fechaCaducidad: z.string().optional(),
});

export const GastoFijoSchema = z.object({
  concepto: z.string().min(1, "El concepto es obligatorio").max(100),
  monto: z.number().positive("El monto debe ser positivo"),
  categoria: z.enum(["operativo", "servicios", "renta", "personal", "otro"]),
});

export const MermaSchema = z.object({
  productoId: z.string().min(1),
  productoNombre: z.string().min(1),
  cantidad: z.number().positive(),
  motivo: z.string().min(1).max(200),
});

export const CajeroSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1, "El nombre del cajero es obligatorio").max(80),
  pin: z.string().regex(/^\d{4}$/, "El PIN debe ser exactamente de 4 dígitos"),
  turno: z.string().max(50).optional(),
  activo: z.boolean().default(true),
});

export const ChatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000),
    })
  ),
  context: z.record(z.string(), z.any()).optional(),
});
