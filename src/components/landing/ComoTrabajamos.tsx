'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ScanSearch, Workflow, Rocket, HeartHandshake,
  ArrowRight, CheckCircle, Zap,
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const steps = [
  {
    number: '01',
    icon: ScanSearch,
    color: 'cyan',
    title: 'Diagnóstico Inteligente',
    subtitle: 'Entendemos tu negocio en profundidad',
    description:
      'Realizamos un análisis de tus flujos operativos, cuellos de botella y oportunidades de automatización. Nuestros agentes mapean tus procesos actuales en menos de 48 horas.',
    tags: ['Auditoría de procesos', 'Identificación de KPIs', 'Mapa de automatización'],
  },
  {
    number: '02',
    icon: Workflow,
    color: 'violet',
    title: 'Diseño de Agentes IA',
    subtitle: 'Arquitectura personalizada para tu sector',
    description:
      'Diseñamos agentes especializados que hablan el idioma de tu industria — desde restaurantes hasta fintech. Cada agente se calibra con los datos reales de tu empresa.',
    tags: ['Agentes verticales', 'Fine-tuning sectorial', 'Integración nativa'],
  },
  {
    number: '03',
    icon: Rocket,
    color: 'emerald',
    title: 'Despliegue y Activación',
    subtitle: 'En producción sin fricción técnica',
    description:
      'Desplegamos la solución sobre tu infraestructura existente o en la nube. El time-to-value es de días, no meses — con monitoreo en tiempo real desde el primer día.',
    tags: ['Implementación en < 7 días', 'CI/CD automatizado', 'Tablero de métricas live'],
  },
  {
    number: '04',
    icon: HeartHandshake,
    color: 'amber',
    title: 'Evolución Continua',
    subtitle: 'Tu IA aprende y mejora contigo',
    description:
      'Cada interacción retroalimenta el modelo. Nuestro equipo en Valladolid te acompaña con soporte 24/7, iteraciones mensuales y actualizaciones de modelos sin costo adicional.',
    tags: ['SLA 99.98%', 'Optimización mensual', 'Soporte presencial'],
  },
];

type ColorKey = 'cyan' | 'violet' | 'emerald' | 'amber';

const colorMap: Record<ColorKey, {
  ring: string; icon: string; badge: string; num: string; glow: string; line: string;
}> = {
  cyan: {
    ring: 'border-cyan-500/40 hover:border-cyan-400/70',
    icon: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    num: 'text-cyan-400',
    glow: 'from-cyan-500/20 to-transparent',
    line: 'bg-gradient-to-b from-cyan-500/50 to-violet-500/50',
  },
  violet: {
    ring: 'border-violet-500/40 hover:border-violet-400/70',
    icon: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    badge: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
    num: 'text-violet-400',
    glow: 'from-violet-500/20 to-transparent',
    line: 'bg-gradient-to-b from-violet-500/50 to-emerald-500/50',
  },
  emerald: {
    ring: 'border-emerald-500/40 hover:border-emerald-400/70',
    icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    num: 'text-emerald-400',
    glow: 'from-emerald-500/20 to-transparent',
    line: 'bg-gradient-to-b from-emerald-500/50 to-amber-500/50',
  },
  amber: {
    ring: 'border-amber-500/40 hover:border-amber-400/70',
    icon: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    badge: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    num: 'text-amber-400',
    glow: 'from-amber-500/10 to-transparent',
    line: '',
  },
};

export default function ComoTrabajamos() {
  return (
    <section id="como-trabajamos" className="relative py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/5 mb-5 shadow-[0_0_15px_rgba(34,230,214,0.12)]"
        >
          <Zap className="w-3.5 h-3.5" />
          Metodología Probada
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
        >
          ¿Cómo{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
            transformamos
          </span>{' '}
          tu negocio?
        </motion.h2>

        <motion.p variants={fadeUp} className="mt-5 text-[#8998C2] text-base md:text-lg leading-relaxed">
          Un proceso claro, medible y sin burocracia. Desde el diagnóstico hasta
          la evolución continua, cada etapa está diseñada para generar resultados
          tangibles desde el primer día.
        </motion.p>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="relative"
      >
        {steps.map((step, idx) => {
          const c = colorMap[step.color as ColorKey];
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <motion.div key={step.number} variants={fadeLeft} className="relative flex gap-6 md:gap-10 mb-6 last:mb-0">
              {/* Left: icon + connector */}
              <div className="flex flex-col items-center shrink-0">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`relative w-14 h-14 rounded-2xl border ${c.icon} flex items-center justify-center shadow-lg shrink-0 backdrop-blur-md`}
                >
                  <Icon className="w-6 h-6" />
                  {idx === 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-70" />
                  )}
                </motion.div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 mt-3 ${c.line} min-h-[40px] rounded-full`} />
                )}
              </div>

              {/* Right: Card */}
              <motion.div
                whileHover={{ y: -3, scale: 1.005 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`relative flex-1 mb-4 rounded-2xl border bg-slate-900/60 backdrop-blur-md p-6 md:p-8 ${c.ring} transition-all duration-300 overflow-hidden`}
              >
                {/* Corner glow */}
                <div className={`absolute top-0 left-0 w-48 h-24 bg-gradient-to-br ${c.glow} rounded-tl-2xl pointer-events-none`} />

                {/* Step number watermark */}
                <span className={`absolute top-5 right-6 text-5xl font-black opacity-[0.07] select-none ${c.num} leading-none`}>
                  {step.number}
                </span>

                <div className="relative z-10">
                  <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${c.num}`}>
                    Paso {step.number}
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{step.subtitle}</p>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-5">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${c.badge}`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="mt-16 text-center"
      >
        <a
          href="#contacto"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(34,230,214,0.35)] hover:shadow-[0_0_45px_rgba(34,230,214,0.55)] hover:scale-105"
        >
          Iniciar mi diagnóstico gratuito
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="mt-4 text-xs text-slate-500">Sin compromisos · Respuesta en menos de 24 h</p>
      </motion.div>
    </section>
  );
}
