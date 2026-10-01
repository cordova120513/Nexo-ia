'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, Activity, Sparkles, Store, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

const metricBadges = [
  { icon: Cpu, label: 'Latencia Inferencia', value: '< 15 ms' },
  { icon: ShieldCheck, label: 'Seguridad Multi-Tenant', value: 'RLS PostgreSQL' },
  { icon: Activity, label: 'Disponibilidad Continua', value: '99.98% SLA' },
];

// ── Imágenes PyME reales ──────────────────────────────────────────────────
const pymeImages = [
  { src: '/images/empresa1.jpeg', label: 'Restaurante & Café', badge: 'Automatización de pedidos' },
  { src: '/images/empresa2.jpeg', label: 'Comercio Local', badge: 'Control de inventario IA' },
  { src: '/images/empresa3.jpeg', label: 'Tienda de Moda', badge: 'Analítica de ventas live' },
];

// ── Showcase flotante 3D con crossfade ───────────────────────────────────
function PyMEShowcase() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % pymeImages.length), 4000);
    return () => clearInterval(t);
  }, []);

  const img = pymeImages[current];

  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      className="absolute -right-8 lg:right-4 top-20 lg:top-12 w-72 sm:w-[360px] lg:w-[440px] pointer-events-none -z-10 select-none"
    >
      {/* Anillo de resplandor exterior */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-transparent blur-2xl scale-110" />

      {/* Tarjeta principal glassmorphism */}
      <div className="relative rounded-3xl border border-cyan-400/25 bg-slate-900/70 backdrop-blur-xl overflow-hidden shadow-[0_30px_80px_-10px_rgba(34,230,214,0.35)]">

        {/* Imagen con crossfade */}
        <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                unoptimized
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 360px, 440px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Badge rotativo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${current}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.4 }}
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/30 text-[10px] font-bold text-cyan-300"
            >
              <TrendingUp className="w-3 h-3" />
              {img.badge}
            </motion.div>
          </AnimatePresence>

          {/* Indicadores */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {pymeImages.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current ? 'w-5 bg-cyan-400' : 'w-1.5 bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer de la tarjeta */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-cyan-400" />
            <AnimatePresence mode="wait">
              <motion.span
                key={`label-${current}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-semibold text-slate-200"
              >
                {img.label}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">IA Activa ✦</span>
        </div>
      </div>

      {/* Sombra de profundidad */}
      <div className="absolute -bottom-3 left-4 right-4 h-8 bg-cyan-400/10 blur-xl rounded-full" />
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const yBg = useTransform(scrollY, [0, 1000], [0, 220]);
  const yText = useTransform(scrollY, [0, 1000], [0, 60]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[96vh] pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col justify-center items-center text-center overflow-hidden"
    >
      {/* Resplandores volumétricos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#22E6D6]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Showcase PyME flotante */}
      <PyMEShowcase />

      {/* Contenido Hero */}
      <motion.div style={{ y: yText }} className="relative z-10 flex flex-col items-center">
        {/* Badge animado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-400/40 bg-slate-900/85 text-cyan-300 text-xs font-semibold tracking-wide mb-8 backdrop-blur-xl shadow-[0_0_25px_rgba(34,230,214,0.2)] cursor-default select-none transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,230,214,0.35)]"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            NEXO.IA • Consultoría & Inteligencia Artificial Automatizada
          </span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]"
        >
          Revolucionamos tu negocio con{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-sky-400 drop-shadow-[0_0_35px_rgba(34,230,214,0.45)]">
            inteligencia automatizada
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.25 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow-sm"
        >
          Consultoría estratégica de IA, flujos automatizados de atención a clientes y analítica en tiempo real para hacer crecer tu PyME sin sobrecostos.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.35 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg"
        >
          <motion.button
            onClick={() => {
              const event = new CustomEvent('open-diagnostico');
              window.dispatchEvent(event);
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={springTransition}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#22E6D6] via-cyan-300 to-cyan-400 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-[0_0_30px_rgba(34,230,214,0.45)] hover:shadow-[0_0_50px_rgba(34,230,214,0.7)] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Iniciar Diagnóstico Gratis</span>
          </motion.button>

          <motion.a
            href="#acerca-de-nosotros"
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            transition={springTransition}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/80 backdrop-blur-xl px-7 py-4 text-sm font-semibold text-slate-100 hover:border-cyan-400/60 hover:bg-slate-800 hover:shadow-[0_0_30px_rgba(34,230,214,0.2)] transition-all group"
          >
            <span>Conoce nuestra consultoría</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1.5 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Tarjeta Núcleo IA Flotante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springTransition, delay: 0.4 }}
          whileHover={{ scale: 1.04, y: -4 }}
          className="mt-12 inline-flex items-center gap-4 px-6 py-3.5 rounded-2xl border border-cyan-400/35 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_30px_rgba(34,230,214,0.2)] hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,230,214,0.35)] transition-all duration-300"
        >
          <motion.div
            animate={{ 
              y: [-6, 6, -6],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
              filter: [
                'drop-shadow(0 0 12px rgba(34,230,214,0.5)) drop-shadow(0 0 25px rgba(56,189,248,0.3))',
                'drop-shadow(0 0 25px rgba(34,230,214,0.95)) drop-shadow(0 0 45px rgba(34,230,214,0.6))',
                'drop-shadow(0 0 12px rgba(34,230,214,0.5)) drop-shadow(0 0 25px rgba(56,189,248,0.3))',
              ]
            }}
            transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
            className="w-11 h-11 sm:w-14 sm:h-14 relative flex-shrink-0"
          >
            <Image
              src="/images/ai-core.png"
              alt="Núcleo de IA NEXO"
              fill
              priority
              unoptimized
              sizes="56px"
              className="object-contain"
            />
          </motion.div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">Motor Automatizado Activo</span>
            </div>
            <p className="text-xs text-slate-300">Asistencia y automatización continua para ventas, cotizaciones y analítica</p>
          </div>
        </motion.div>

        {/* Barra de Telemetría */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.45 }}
          className="mt-12 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {metricBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -6 }}
                transition={springTransition}
                className="p-4 rounded-2xl border border-slate-700/60 bg-slate-900/75 backdrop-blur-xl flex items-center gap-3.5 hover:border-cyan-400/50 hover:bg-slate-800/80 hover:shadow-[0_15px_35px_-5px_rgba(34,230,214,0.2)] transition-all"
              >
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-medium">{badge.label}</div>
                  <div className="text-base font-bold text-white">{badge.value}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
