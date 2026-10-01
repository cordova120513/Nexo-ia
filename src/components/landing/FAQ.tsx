'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Shield, Zap, Lock, Sparkles } from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: 'Integración & Conectividad',
    question: '¿Cómo se integra NEXO.IA con los sistemas existentes de mi empresa (ERP, CRM)?',
    answer: 'NEXO.IA cuenta con conectores universales pre-construidos para SAP, Salesforce, HubSpot, Oracle, bases de datos PostgreSQL/MySQL y endpoints REST/GraphQL. Además, soporta webhooks bidireccionales y SDKs en TypeScript y Python, permitiendo desplegar agentes en minutos sin modificar tu arquitectura legacy.',
  },
  {
    id: 2,
    category: 'Seguridad & Privacidad',
    question: '¿Qué garantías de privacidad y seguridad de datos ofrece la plataforma?',
    answer: 'Implementamos aislamiento riguroso multi-tenant con Row Level Security (RLS) en PostgreSQL nativo, cifrado AES-256 en reposo y TLS 1.3 en tránsito. Tus datos corporativos NUNCA se utilizan para re-entrenar modelos públicos ni se comparten entre organizaciones.',
  },
  {
    id: 3,
    category: 'Despliegue & Tiempos',
    question: '¿Cuánto tiempo toma desplegar un agente autónomo en producción?',
    answer: 'Gracias a nuestra infraestructura serverless y plantillas prediseñadas por vertical, puedes configurar, calibrar y desplegar un agente funcional en menos de 48 horas. Para soluciones corporativas con fine-tuning personalizado, los tiempos promedio oscilan entre 5 y 10 días hábiles.',
  },
  {
    id: 4,
    category: 'Modelos & Inteligencia',
    question: '¿Qué modelos de inteligencia artificial alimentan la plataforma?',
    answer: 'NEXO.IA opera sobre una arquitectura agnóstica de orquestación multi-modelo: integra Google Gemini 1.5 Pro / Flash, Claude 3.5 Sonnet y modelos locales de código abierto (Llama 3 / Mistral) para optimizar costo, latencia y precisión según la tarea requerida.',
  },
  {
    id: 5,
    category: 'Rendimiento & SLA',
    question: '¿Cómo funciona la arquitectura de baja latencia y alta disponibilidad?',
    answer: 'La plataforma está distribuida en nodos Edge globales con Next.js 16 y Supabase SSR. Ofrecemos tiempos de respuesta de inferencia sub-15ms y un acuerdo de nivel de servicio (SLA) del 99.98% con conmutación por error automatizada en tiempo real.',
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      transition={springTransition}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'bg-slate-900/90 backdrop-blur-xl border-cyan-400/50 shadow-lg shadow-cyan-500/10'
          : 'bg-slate-900/70 backdrop-blur-md border-slate-700/60 hover:border-cyan-400/40 hover:bg-slate-800/80'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-start justify-between gap-4 focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block mb-1">
            {faq.category}
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
            {faq.question}
          </h4>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={springTransition}
          className={`p-2 rounded-xl border flex-shrink-0 transition-colors ${
            isOpen
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springTransition}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/80 mt-1">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section id="faq" className="py-24 px-6 max-w-5xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springTransition}
        className="text-center mb-16"
      >
        <span className="text-xs uppercase tracking-widest text-[#22E6D6] font-bold px-3 py-1.5 rounded-full border border-[#22E6D6]/30 bg-[#22E6D6]/10 inline-block mb-4 shadow-[0_0_15px_rgba(34,230,214,0.15)]">
          Claridad & Respuestas
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#F3F6FC] tracking-tight">
          Preguntas{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E6D6] to-blue-400">
            Frecuentes
          </span>
        </h2>
        <p className="mt-4 text-[#8998C2] text-base md:text-lg max-w-xl mx-auto">
          Todo lo que necesitas saber sobre la implementación, seguridad y retorno de inversión de NEXO.IA.
        </p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}
      </div>
    </section>
  );
}
