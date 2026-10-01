'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, BarChart3, MessageSquare, ShieldCheck, Cpu,
  TrendingUp, Zap, ArrowRight, ChevronRight, Sparkles,
  type LucideIcon,
} from 'lucide-react';

// ─── Animation Variants ────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

// ─── Services Data ─────────────────────────────────────────────────────────
interface Servicio {
  id: string;
  icon: LucideIcon;
  color: string;
  accent: string;
  glow: string;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  metric: { label: string; value: string };
}

const servicios: Servicio[] = [
  {
    id: 'agentes-ia',
    icon: Bot,
    color: 'border-cyan-500/35 hover:border-cyan-400/65',
    accent: 'text-cyan-400',
    glow: 'bg-cyan-500/10',
    tag: 'Core Product',
    title: 'Agentes IA Verticales',
    description:
      'Agentes de inteligencia artificial entrenados para tu industria específica. Automatizan atención al cliente, ventas, inventario y reportes sin intervención humana.',
    bullets: [
      'Integración con WhatsApp y Messenger',
      'Respuesta en < 500 ms 24/7',
      'Aprendizaje continuo por interacción',
    ],
    metric: { label: 'Ahorro operativo promedio', value: '−58%' },
  },
  {
    id: 'analítica',
    icon: BarChart3,
    color: 'border-violet-500/35 hover:border-violet-400/65',
    accent: 'text-violet-400',
    glow: 'bg-violet-500/10',
    tag: 'Inteligencia de Negocio',
    title: 'Analítica Predictiva',
    description:
      'Tableros en tiempo real con predicciones de demanda, detección de anomalías y alertas automáticas. Toma decisiones con datos, no con intuición.',
    bullets: [
      'Predicción de demanda a 30/60/90 días',
      'Detección de fraude y mermas',
      'KPIs configurables por rol',
    ],
    metric: { label: 'Precisión de predicción', value: '94.3%' },
  },
  {
    id: 'omnicanal',
    icon: MessageSquare,
    color: 'border-emerald-500/35 hover:border-emerald-400/65',
    accent: 'text-emerald-400',
    glow: 'bg-emerald-500/10',
    tag: 'Comunicación',
    title: 'Comunicación Omnicanal',
    description:
      'Centraliza todos tus canales — WhatsApp, correo, SMS y redes sociales — en una bandeja unificada con clasificación y respuesta automática por IA.',
    bullets: [
      'Bandeja unificada multi-canal',
      'Clasificación semántica de mensajes',
      'Campañas segmentadas con IA',
    ],
    metric: { label: 'Tiempo de respuesta', value: '< 1 min' },
  },
  {
    id: 'seguridad',
    icon: ShieldCheck,
    color: 'border-sky-500/35 hover:border-sky-400/65',
    accent: 'text-sky-400',
    glow: 'bg-sky-500/10',
    tag: 'Infraestructura',
    title: 'Seguridad Empresarial',
    description:
      'Arquitectura multi-tenant con Row Level Security, autenticación de dos factores y cifrado end-to-end. Cumplimiento con LFPDPPP y GDPR.',
    bullets: [
      'RLS por empresa y usuario',
      'Audit logs inmutables',
      'Backup automático cada 6 h',
    ],
    metric: { label: 'Disponibilidad garantizada', value: '99.98%' },
  },
  {
    id: 'automatizacion',
    icon: Cpu,
    color: 'border-amber-500/35 hover:border-amber-400/65',
    accent: 'text-amber-400',
    glow: 'bg-amber-500/10',
    tag: 'Operaciones',
    title: 'Automatización de Procesos',
    description:
      'Workflows inteligentes que eliminan tareas repetitivas: facturación, reabastecimiento, cortes de caja, reportes fiscales y más.',
    bullets: [
      'Corte Z automático al cierre',
      'Reabastecimiento predictivo',
      'Integración con SAT (CFDI 4.0)',
    ],
    metric: { label: 'Horas recuperadas/semana', value: '+18 h' },
  },
  {
    id: 'crecimiento',
    icon: TrendingUp,
    color: 'border-rose-500/35 hover:border-rose-400/65',
    accent: 'text-rose-400',
    glow: 'bg-rose-500/10',
    tag: 'Escalamiento',
    title: 'Estrategia de Crecimiento',
    description:
      'Consultoría estratégica respaldada por datos reales de tu operación. Identificamos oportunidades de expansión, cross-selling y fidelización.',
    bullets: [
      'Mapa de oportunidades por segmento',
      'Cross-selling automatizado por IA',
      'Programas de lealtad inteligentes',
    ],
    metric: { label: 'Incremento en ticket promedio', value: '+23%' },
  },
];

export default function Servicios() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="servicios" className="relative py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-1/3 right-0 w-[480px] h-[480px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Header ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <motion.span
          variants={cardVariant}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-violet-400 font-bold px-3 py-1.5 rounded-full border border-violet-400/25 bg-violet-400/5 mb-5 shadow-[0_0_15px_rgba(139,92,246,0.12)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Suite Completa
        </motion.span>

        <motion.h2
          variants={cardVariant}
          className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
        >
          Todo lo que necesitas para{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400">
            escalar con IA
          </span>
        </motion.h2>

        <motion.p
          variants={cardVariant}
          className="mt-5 text-[#8998C2] text-base md:text-lg leading-relaxed"
        >
          Una plataforma integral. Seis módulos que trabajan en conjunto para transformar
          cada área de tu empresa en un motor de crecimiento autónomo.
        </motion.p>
      </motion.div>

      {/* ── Grid de Servicios ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {servicios.map((s) => {
          const Icon = s.icon;
          const isHovered = hovered === s.id;

          return (
            <motion.div
              key={s.id}
              variants={cardVariant}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className={`relative rounded-2xl border bg-slate-900/60 backdrop-blur-md p-6 cursor-default transition-all duration-300 overflow-hidden ${s.color}`}
            >
              {/* Glow on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    key="glow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 ${s.glow} rounded-2xl pointer-events-none`}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10">
                {/* Tag + Icon row */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${s.glow} border-current/20 ${s.accent}`}>
                    {s.tag}
                  </span>
                  <div className={`w-10 h-10 rounded-xl ${s.glow} border border-current/10 flex items-center justify-center ${s.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-white tracking-tight mb-2">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  {s.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-1.5 mb-5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-300">
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${s.accent}`} />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Metric */}
                <div className={`flex items-center justify-between pt-4 border-t border-slate-800`}>
                  <span className="text-[11px] text-slate-500">{s.metric.label}</span>
                  <span className={`text-base font-black ${s.accent}`}>{s.metric.value}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Bottom CTA Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: 'easeOut', delay: 0.2 }}
        className="mt-16 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-slate-900/80 via-slate-900/90 to-slate-900/80 backdrop-blur-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        {/* Banner glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Oferta Especial</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Diagnóstico gratuito de 90 minutos
          </h3>
          <p className="mt-2 text-slate-400 text-sm md:text-base max-w-xl">
            Sin costo, sin compromiso. Analizamos tu operación y te entregamos un plan de automatización personalizado con ROI estimado.
          </p>
        </div>

        <a
          href="#contacto"
          className="relative z-10 shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(34,230,214,0.3)] hover:shadow-[0_0_45px_rgba(34,230,214,0.5)] hover:scale-105 whitespace-nowrap"
        >
          Quiero mi diagnóstico
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}
