'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Bot, BarChart3, Cpu, ShieldCheck, ArrowRight, Zap, CheckCircle2, GitBranch } from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

export default function BentoGrid() {
  return (
    <section id="bento-grid" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Resplandor decorativo */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#22E6D6]/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Cabecera de la sección */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springTransition}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="text-xs uppercase tracking-widest text-[#22E6D6] font-bold px-3 py-1.5 rounded-full border border-[#22E6D6]/30 bg-[#22E6D6]/10 inline-block mb-4 shadow-[0_0_15px_rgba(34,230,214,0.15)]">
          Capacidades de Vanguardia
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#F3F6FC] tracking-tight">
          Arquitectura Cognitiva diseñada para{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E6D6] to-blue-400">
            Escalar
          </span>
        </h2>
        <p className="mt-4 text-slate-300 text-base md:text-lg">
          NEXO.IA combina el poder de flujos automatizados con IA, inferencia ultra-rápida y seguridad de datos blindada en un solo stack unificado.
        </p>
      </motion.div>

      {/* Grid estilo 21st.dev */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Agentes Automatizados (Span 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.02, y: -6 }}
          transition={springTransition}
          className="md:col-span-2 rounded-3xl border border-slate-700/70 bg-slate-900/75 backdrop-blur-xl p-8 sm:p-10 relative overflow-hidden group hover:border-cyan-400/60 transition-all shadow-xl shadow-slate-950/40 flex flex-col justify-between"
        >
          {/* Luz ambiental en hover */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/25 transition-all duration-500 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-6 shadow-sm">
                <Bot className="h-8 w-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Agentes Automatizados Multi-Rol
              </h3>
              <p className="text-slate-300 max-w-xl text-base leading-relaxed">
                Despliega asistentes inteligentes capaces de interpretar contextos comerciales, ejecutar herramientas externas y automatizar flujos de trabajo sin fricción.
              </p>
            </div>

            {/* ai-core.png con animación de pulso dinámico, rotación y resplandor neón */}
            <motion.div
              animate={{
                y: [-8, 8, -8],
                rotate: [0, 180, 360],
                scale: [1, 1.08, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut",
              }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 self-center sm:self-start p-2.5 rounded-2xl bg-cyan-950/40 border border-[#22E6D6]/40 backdrop-blur-md shadow-[0_0_35px_rgba(34,230,214,0.35)] flex items-center justify-center group-hover:border-[#22E6D6] group-hover:shadow-[0_0_50px_rgba(34,230,214,0.55)] transition-all"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/ai-core.png"
                  alt="Núcleo de IA Capacidades"
                  fill
                  unoptimized
                  sizes="128px"
                  className="object-contain filter drop-shadow-[0_0_20px_rgba(34,230,214,0.7)] drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]"
                />
              </div>
              <span className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-[#050B1F] border border-[#22E6D6]/50 text-[10px] font-mono text-[#22E6D6] font-bold shadow-[0_0_10px_rgba(34,230,214,0.3)]">
                AI CORE v3
              </span>
            </motion.div>
          </div>

          {/* Mini-Simulador Visual de Flujo de Decisión */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#050B1F]/80 p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-[#8998C2] pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22E6D6] animate-pulse" />
                <span className="font-semibold text-[#F3F6FC]">Pipeline Autónomo de Ejecución</span>
              </div>
              <span className="text-[#22E6D6] font-mono text-[11px]">8.2ms ejecución</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-[#0A1730]/60 border border-white/5 flex flex-col">
                <span className="text-[10px] text-[#8998C2] uppercase font-bold">1. Input Contextual</span>
                <span className="text-xs text-[#F3F6FC] font-medium mt-1">Prompt / Evento Webhook</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1730]/60 border border-[#22E6D6]/30 flex flex-col">
                <span className="text-[10px] text-[#22E6D6] uppercase font-bold">2. Inferencia & RAG</span>
                <span className="text-xs text-[#F3F6FC] font-medium mt-1">Búsqueda Semántica Vector</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1730]/60 border border-white/5 flex flex-col">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">3. Acción Directa</span>
                <span className="text-xs text-slate-200 font-medium mt-1">Llamada a API ERP / CRM</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Métricas Predictivas (Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.015, y: -4 }}
          transition={{ ...springTransition, delay: 0.1 }}
          className="rounded-3xl border border-slate-700/70 bg-slate-900/75 backdrop-blur-xl p-8 sm:p-10 relative overflow-hidden group hover:border-cyan-400/50 transition-all shadow-xl shadow-slate-950/40 flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/25 mb-6">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 tracking-tight">
              Métricas Predictivas
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Monitoreo analítico y pronóstico de demanda impulsado por modelos estadísticos de alta fidelidad.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs text-slate-400">Precisión del Modelo</span>
              <span className="text-lg font-black text-cyan-300">99.4%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[99.4%] rounded-full shadow-[0_0_10px_#22E6D6]" />
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">Calibración en tiempo real</span>
          </div>
        </motion.div>

        {/* Card 3: Latencia Ultra Baja (Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.015, y: -4 }}
          transition={{ ...springTransition, delay: 0.15 }}
          className="rounded-3xl border border-slate-700/70 bg-slate-900/75 backdrop-blur-xl p-8 sm:p-10 relative overflow-hidden group hover:border-cyan-400/50 transition-all shadow-xl shadow-slate-950/40 flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 mb-6">
              <Cpu className="h-8 w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 tracking-tight">
              Latencia Sub-15ms
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Infraestructura serverless con Next.js 16, Supabase SSR y nodos Edge distribuidos globalmente.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs text-slate-400">Tiempo de Respuesta TTFB</div>
              <div className="text-sm font-bold text-white">11.4 ms promedio</div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Seguridad Empresarial (Span 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.015, y: -4 }}
          transition={{ ...springTransition, delay: 0.2 }}
          className="md:col-span-2 rounded-3xl border border-slate-700/70 bg-slate-900/75 backdrop-blur-xl p-8 sm:p-10 relative overflow-hidden group hover:border-cyan-400/50 transition-all shadow-xl shadow-slate-950/40 flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
              Seguridad Nivel Bancario & RLS
            </h3>
            <p className="text-slate-300 max-w-xl text-base leading-relaxed">
              Aislamiento absoluto de datos multi-tenant mediante políticas Row Level Security (RLS) en PostgreSQL, cifrado de extremo a extremo (AES-256) y auditoría inmutable.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-200 font-medium">PostgreSQL RLS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-200 font-medium">Cifrado AES-256</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-200 font-medium">SOC2 Type II Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-200 font-medium">Auditoría en Vivo</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
