'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import GoogleButton from '@/components/auth/GoogleButton';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

export default function Footer() {
  return (
    <footer className="relative bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/80 pt-20 pb-12 px-6 overflow-hidden">
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Banner de Conversión estilo 21st.dev */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.015, y: -4 }}
          transition={springTransition}
          className="rounded-3xl border border-slate-700/70 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl hover:border-cyan-400/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs uppercase font-bold tracking-widest text-cyan-300 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 inline-block mb-4 shadow-[0_0_15px_rgba(34,230,214,0.15)]">
            Empieza la Transformación
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Diseñado para empresas que no temen{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400">
              liderar el futuro
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Integra inteligencia artificial automatizada y reduce costos operativos hoy mismo con NEXO.IA.
          </p>

          <div className="mt-8 flex justify-center items-center">
            <GoogleButton />
          </div>
        </motion.div>
      </div>

      {/* Footer Links & Derechos */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-base text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>NEXO<span className="text-cyan-400">.IA</span></span>
          </Link>
          <span className="text-slate-700">|</span>
          <span>© {new Date().getFullYear()} NEXO.IA Systems Inc. Todos los derechos reservados.</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistemas Operativos 99.98% SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
