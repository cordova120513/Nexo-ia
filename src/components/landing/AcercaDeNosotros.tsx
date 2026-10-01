'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Eye, Award, Users2, ShieldCheck, Zap, 
  ArrowUpRight, Sparkles, CheckCircle2, Building, HeartHandshake, Compass
} from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

export default function AcercaDeNosotros() {
  const pilares = [
    {
      icon: Zap,
      title: 'Accesibilidad Radical',
      desc: 'Tecnología de nivel corporativo adaptada a presupuestos y necesidades reales de comercios y PyMEs mexicanas.',
    },
    {
      icon: HeartHandshake,
      title: 'Acompañamiento Humano + IA',
      desc: 'No te dejamos solo con un software: diseñamos, entrenamos y calibramos cada agente para tu giro específico.',
    },
    {
      icon: ShieldCheck,
      title: 'Privacidad & Blindaje RLS',
      desc: 'Tus catálogos, pedidos y registros contables están aislados con seguridad estricta PostgreSQL multi-tenant.',
    },
    {
      icon: Award,
      title: 'Resultados Financieros Medibles',
      desc: 'Enfocados en recuperar ventas nocturnas perdidas, eliminar mermas no registradas y ahorrar horas de trabajo.',
    },
  ];

  return (
    <section id="acerca-de-nosotros" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Resplandor suave decorativo */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cabecera de la sección */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springTransition}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 inline-block mb-4 shadow-[0_0_20px_rgba(34,230,214,0.15)]">
          Consultoría de IA para PyMEs
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Acerca de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400">
            NEXO.IA
          </span>
        </h2>
        <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
          Somos una firma consultora y desarrolladora de tecnología que acompaña a dueños de negocios a eliminar tareas manuales repetitivas, recuperar ventas desatendidas y multiplicar su rentabilidad con inteligencia artificial automatizada.
        </p>
      </motion.div>

      {/* Bloque Explicativo de Consultoría */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={springTransition}
        className="mb-16 p-8 sm:p-10 rounded-3xl border border-slate-700/70 bg-slate-900/75 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Nuestra Propuesta de Valor</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ¿Por qué una consultoría de IA especializada en pequeños negocios?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              La mayoría de herramientas de IA en el mercado están diseñadas para programadores o gigantes multinacionales con departamentos de TI. En <strong>NEXO.IA</strong> cerramos esa brecha: diagnosticamos las fugas de tiempo de tu negocio local, construimos flujos automatizados de WhatsApp y seguimiento de inventario listos para operar, y capacitamos a tu equipo paso a paso.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sin tecnicismos complicados</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Puesta en marcha en días, no meses</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Atención humana personalizada</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Retorno de inversión medible</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3.5">
            <div className="p-4 rounded-2xl border border-slate-700/80 bg-slate-950/60 backdrop-blur-md">
              <span className="text-2xl font-black text-cyan-300 block mb-0.5">38%</span>
              <span className="text-xs text-slate-300 font-medium">Incremento promedio en ventas recuperadas fuera del horario laboral.</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-700/80 bg-slate-950/60 backdrop-blur-md">
              <span className="text-2xl font-black text-teal-300 block mb-0.5">&gt; 3 Horas</span>
              <span className="text-xs text-slate-300 font-medium">Ahorradas diariamente por cada colaborador en mensajes repetitivos.</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-700/80 bg-slate-950/60 backdrop-blur-md">
              <span className="text-2xl font-black text-sky-300 block mb-0.5">100%</span>
              <span className="text-xs text-slate-300 font-medium">Control de stock, registro de pedidos y alertas tempranas de merma.</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Misión y Visión: Tarjetas Integradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Tarjeta Misión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          whileHover={{ y: -4 }}
          transition={springTransition}
          className="p-8 sm:p-9 rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/90 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-cyan-400/50 transition-all"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-6">
            <Target className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block mb-2">Pilar Central</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">Nuestra Misión</h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Democratizar el acceso a la inteligencia artificial automatizada para comerciantes, emprendedores y pequeñas y medianas empresas, transformando procesos manuales tediosos en sistemas autónomos de ventas y gestión que impulsen su productividad y rentabilidad financiera.
          </p>
        </motion.div>

        {/* Tarjeta Visión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          whileHover={{ y: -4 }}
          transition={springTransition}
          className="p-8 sm:p-9 rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/90 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-teal-400/50 transition-all"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />
          <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 text-teal-300 border border-teal-500/30 mb-6">
            <Eye className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-teal-400 font-bold block mb-2">Horizonte 2030</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">Nuestra Visión</h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Posicionarnos como el ecosistema de consultoría y automatización con IA líder en el sureste y todo México, convirtiendo a más de 10,000 negocios tradicionales en organizaciones tecnológicas de alto desempeño que crecen de manera sostenible y sin fricciones operativas.
          </p>
        </motion.div>
      </div>

      {/* Tarjetas de Pilares de NEXO.IA */}
      <div>
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-white">Los Pilares que Respaldan a NEXO.IA</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Nuestros principios inquebrantables de servicio y desarrollo tecnológico.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pilares.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springTransition, delay: idx * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-xl hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
