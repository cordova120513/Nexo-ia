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

// ── Imágenes PyME reales de NEXO.IA ─────────────────────────────────────────
const pymeBusinesses = [
  {
    id: 'cafe',
    src: '/images/pyme-cafe.jpg',
    name: 'Cafetería & Restaurante Local',
    category: 'Gastronomía y Hospitalidad',
    badge: 'Atención WhatsApp IA 24/7',
    metric: '+42% pedidos digitales',
    highlight: 'Toma pedidos automáticamente, envía menú interactivo y gestiona comandas al instante.',
  },
  {
    id: 'ropa',
    src: '/images/pyme-ropa.jpeg',
    name: 'Boutique & Comercio de Moda',
    category: 'Retail y Tiendas Físicas',
    badge: 'Control de Inventario IA',
    metric: '-85% tiempo en inventarios',
    highlight: 'Alertas predictivas de stock bajo y analítica en tiempo real del ticket promedio.',
  },
  {
    id: 'horno',
    src: '/images/pyme-horno.jpeg',
    name: 'Panadería & Alimentos Artesanales',
    category: 'Producción Diaria y Mostrador',
    badge: 'Predicción de Demanda',
    metric: '-30% merma de producción',
    highlight: 'Calcula producción óptima diaria reduciendo desperdicios y maximizando margen.',
  },
  {
    id: 'taller',
    src: '/images/pyme-taller.jpeg',
    name: 'Taller & Fabricación Local',
    category: 'Manufactura y Servicios',
    badge: 'Cotizador Instantáneo',
    metric: 'Cotizaciones en < 2 min',
    highlight: 'Genera cotizaciones técnicas y presupuestos detallados a clientes sin demoras.',
  },
  {
    id: 'invernadero',
    src: '/images/pyme-invernadero.jpeg',
    name: 'Invernadero & Agro PyME',
    category: 'Cultivo e Innovación Local',
    badge: 'Telemetría Inteligente',
    metric: 'Monitoreo 24/7 sin fallas',
    highlight: 'Supervisión continua con alertas preventivas automáticas directamente al móvil.',
  },
];

// ── Showcase PyME inmersivo y responsivo ────────────────────────────────────
function PyMEInteractiveShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % pymeBusinesses.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activePyme = pymeBusinesses[activeIdx];

  return (
    <div className="w-full max-w-5xl mt-14">
      {/* Selector de pestañas PyME */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {pymeBusinesses.map((pyme, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={pyme.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/80 text-cyan-200 shadow-[0_0_20px_rgba(34,230,214,0.3)]'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Store className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`} />
              <span>{pyme.name.split(' ')[0]}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tarjeta principal con la foto real de la PyME */}
      <div className="relative rounded-3xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-2xl overflow-hidden shadow-[0_25px_70px_-15px_rgba(34,230,214,0.25)]">
        {/* Resplandor superior interior */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Columna Izquierda: Información de impacto del negocio */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-left order-2 lg:order-1">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-4">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{activePyme.category}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePyme.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {activePyme.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {activePyme.highlight}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Flujo Activo</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5 truncate">{activePyme.badge}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Resultado PyME</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5 truncate">{activePyme.metric}</div>
                </div>
              </div>

              {/* Barra de progreso de auto-play */}
              <div className="flex gap-1.5 mt-5">
                {pymeBusinesses.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-800 cursor-pointer"
                  >
                    <div
                      className={`h-full transition-all duration-500 ${
                        i === activeIdx ? 'w-full bg-cyan-400' : 'w-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Foto real de la PyME en alta resolución */}
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden order-1 lg:order-2 bg-slate-950">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePyme.src}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={activePyme.src}
                  alt={activePyme.name}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                {/* Degradado sobre la imagen para contraste estético */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900/90 lg:via-transparent lg:to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Chip de estado en vivo sobre la imagen */}
            <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/40 shadow-lg text-[11px] font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PyME Digitalizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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

        {/* Showcase de Casos Reales PyME con Imágenes Auténticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.38 }}
          className="w-full flex justify-center"
        >
          <PyMEInteractiveShowcase />
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
