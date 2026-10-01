'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, Bot, BarChart4, Sparkles as SparklesIcon, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

interface FaseItem {
  id: number;
  paso: string;
  badge: string;
  title: string;
  metric: string;
  image: string;
  alt: string;
  tagline: string;
  desc: string;
  beneficios: string[];
}

const fases: FaseItem[] = [
  {
    id: 1,
    paso: 'Fase 01',
    badge: 'Auditoría 48h',
    title: 'Diagnóstico e Identificación',
    metric: 'Detección de fugas en 48 horas',
    image: '/images/Empresa 1.jpeg',
    alt: 'Diagnóstico Empresarial NEXO.IA',
    tagline: 'Mapeo integral de procesos y cuellos de botella',
    desc: 'Evaluamos tus canales de atención, tiempos muertos respondiendo mensajes y fugas silenciosas en inventario o mermas.',
    beneficios: ['Auditoría de canales de venta', 'Cuantificación de ventas perdidas', 'Matriz de rentabilidad inmediata'],
  },
  {
    id: 2,
    paso: 'Fase 02',
    badge: 'Automatización',
    title: 'Despliegue de Agentes',
    metric: 'Atención 24/7 sin perder ventas',
    image: '/images/Empresa 2.jpeg',
    alt: 'Agentes Autónomos NEXO.IA',
    tagline: 'Orquestación de bots autónomos entrenados',
    desc: 'Calibramos agentes inteligentes en WhatsApp con tu catálogo de productos y precios para vender y cotizar sin descanso.',
    beneficios: ['Agente WhatsApp con IA contextual', 'Sincronización con catálogo y stock', 'Cierre de pedidos automatizado'],
  },
  {
    id: 3,
    paso: 'Fase 03',
    badge: 'Dashboard Pyme',
    title: 'Métricas en Vivo',
    metric: 'Balance neto y mermas en tiempo real',
    image: '/images/Empresa 3.jpeg',
    alt: 'Control Operativo NEXO.IA',
    tagline: 'Panel ejecutivo con analítica predictiva',
    desc: 'Accede a tu panel personalizado para ingresar productos, registrar ventas diarias y monitorear la ganancia neta exacta.',
    beneficios: ['Registro de ventas y pérdidas diarias', 'Monitoreo de mermas y devaluación', 'Predicción de ingresos con IA'],
  },
];

export default function Soluciones3D() {
  const [activeFase, setActiveFase] = useState<number>(1);

  return (
    <section 
      id="como-trabajamos" 
      className="relative w-full py-28 bg-[#050B1F]/60 backdrop-blur-sm overflow-hidden border-t border-white/10"
    >
      {/* Fondo sutil con diagnostic-bg.jpg — cargado en resolución completa sin compresión */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 mix-blend-luminosity pointer-events-none">
        <Image
          src="/images/diagnostic-bg.jpg"
          alt="Diagnóstico Empresarial"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#050B1F]/90 via-[#050B1F]/60 to-[#050B1F]/90" />

      {/* Resplandores volumétricos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#22E6D6]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Encabezado de la Sección */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22E6D6]/30 bg-[#22E6D6]/10 text-[#22E6D6] text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(34,230,214,0.15)]"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          Metodología de Trabajo para Pymes
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-[#F3F6FC] tracking-tight leading-tight"
        >
          Cómo transformamos tu negocio{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E6D6] via-cyan-300 to-blue-400">
            paso a paso
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#8998C2] mt-4 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Un proceso ágil y transparente diseñado para micro, pequeñas y medianas empresas: desde el diagnóstico de ineficiencias hasta la autonomía operativa total.
        </motion.p>
      </div>

      {/* =========================================================================
          BLOQUE SUPERIOR: GALERÍA DE IMÁGENES CON ESCALONADO DE PROFUNDIDAD 3D
          Primera tarjeta al frente y siguientes con suave perspectiva hacia atrás.
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {fases.map((fase) => {
            const isSelected = activeFase === fase.id;
            
            // Escalonado de profundidad 3D suave:
            // Fase 1: ligeramente al frente
            // Fase 2 & 3: perspectiva hacia atrás, manteniendo legibilidad total y limpia
            const depthClass = 
              fase.id === 1
                ? 'md:scale-[1.04] md:translate-y-[-6px] z-20 shadow-[0_25px_50px_-12px_rgba(34,230,214,0.3)]'
                : fase.id === 2
                ? 'md:scale-[1.0] md:translate-y-[2px] z-10 opacity-95'
                : 'md:scale-[0.97] md:translate-y-[8px] z-0 opacity-90';

            return (
              <motion.div
                key={fase.id}
                onClick={() => setActiveFase(fase.id)}
                whileHover={{ scale: 1.05, y: -8, zIndex: 30 }}
                transition={springTransition}
                className={`relative rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer group bg-[#0A1730]/90 backdrop-blur-md ${depthClass} ${
                  isSelected
                    ? 'border-[#22E6D6] shadow-[0_0_35px_rgba(34,230,214,0.4)] ring-2 ring-[#22E6D6]/40'
                    : 'border-white/10 hover:border-[#22E6D6]/70 hover:shadow-[0_20px_45px_rgba(34,230,214,0.25)]'
                }`}
              >
                {/* Imagen fotorrealista de la empresa (máxima resolución sin compresión) */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <Image
                    src={fase.image}
                    alt={fase.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1730] via-[#0A1730]/30 to-transparent" />

                  {/* Badge de Fase Flotante Superior */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#050B1F]/90 text-[#22E6D6] font-mono text-xs font-bold border border-[#22E6D6]/40 backdrop-blur-md shadow-lg">
                      {fase.paso}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#22E6D6]/20 text-cyan-200 text-[11px] font-semibold backdrop-blur-md border border-[#22E6D6]/30">
                      {fase.badge}
                    </span>
                  </div>

                  {/* Indicador de Selección Activa */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22E6D6] text-[#050B1F] text-xs font-extrabold shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-[#050B1F] animate-ping" />
                      <span>Fase Activa</span>
                    </div>
                  )}

                  {/* Tagline en base de la imagen */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-bold text-[#F3F6FC] drop-shadow-md">
                      {fase.tagline}
                    </p>
                  </div>
                </div>

                {/* Micro-resumen en tarjeta de imagen */}
                <div className="p-4 bg-[#0A1730] border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3F6FC]">{fase.title}</span>
                  <span className="text-[11px] font-semibold text-[#22E6D6] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22E6D6] animate-pulse" />
                    {fase.metric}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ESPACIADOR VERTICAL AMPLIO
          Garantiza que NUNCA se encimen ni tapen el contenido entre imágenes y texto
          ========================================================================= */}
      <div className="w-full my-8 lg:my-12 flex items-center justify-center">
        <div className="h-px w-2/3 max-w-4xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* =========================================================================
          BLOQUE INFERIOR: 3 CUADROS DE TEXTO ESTRUCTURADOS CON ESPACIADO LIMPIO
          "Diagnóstico e Identificación", "Despliegue de Agentes", "Métricas en Vivo"
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {fases.map((fase) => {
            const isSelected = activeFase === fase.id;
            const Icon = fase.id === 1 ? Search : fase.id === 2 ? Bot : BarChart4;

            return (
              <motion.div
                key={fase.id}
                onClick={() => setActiveFase(fase.id)}
                whileHover={{ y: -4 }}
                transition={springTransition}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A1730] border-[#22E6D6] shadow-[0_0_30px_rgba(34,230,214,0.25)] ring-1 ring-[#22E6D6]/40 -translate-y-1'
                    : 'bg-[#0A1730]/70 border-white/10 hover:border-[#22E6D6]/40 hover:bg-[#0A1730]'
                }`}
              >
                <div>
                  {/* Cabecera del cuadro con icono */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isSelected
                          ? 'bg-[#22E6D6]/20 border-[#22E6D6] text-[#22E6D6]'
                          : 'bg-white/5 border-white/10 text-[#8998C2]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase text-[#22E6D6] px-3 py-1 rounded-full bg-[#22E6D6]/10 border border-[#22E6D6]/25">
                      {fase.paso}
                    </span>
                  </div>

                  {/* Título Oficial del Paso */}
                  <h3 className="text-xl sm:text-2xl font-black text-[#F3F6FC] tracking-tight leading-snug">
                    {fase.title}
                  </h3>

                  {/* Métrica clave en color neon */}
                  <div className="mt-2 text-xs font-bold text-[#22E6D6] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22E6D6] animate-pulse" />
                    <span>{fase.metric}</span>
                  </div>

                  {/* Descripción completa sin truncar */}
                  <p className="text-[#8998C2] text-sm leading-relaxed mt-3">
                    {fase.desc}
                  </p>

                  {/* Lista de Beneficios */}
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                    {fase.beneficios.map((ben, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#F3F6FC]/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22E6D6] flex-shrink-0" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de acción rápida */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#8998C2] font-semibold">{fase.badge}</span>
                  <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-[#22E6D6]' : 'text-[#8998C2]'}`}>
                    <span>Ver detalles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
