'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ShoppingBag, Truck, HeartPulse, CheckCircle2, ArrowRight, Terminal, Sparkles, type LucideIcon } from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

interface IndustryDetail {
  id: string;
  name: string;
  badge: string;
  icon: LucideIcon;
  headline: string;
  description: string;
  kpis: { label: string; value: string }[];
  agents: string[];
  codeSnippet: string;
}

const industries: IndustryDetail[] = [
  {
    id: 'fintech',
    name: 'Fintech & Banca',
    badge: 'Finanzas Autónomas',
    icon: Building2,
    headline: 'Prevención de Fraude en Tiempo Real & Scoring Algorítmico',
    description: 'Automatiza auditorías de cumplimiento, reconciliación contable y análisis de riesgo crediticio con latencia menor a 15 milisegundos.',
    kpis: [
      { label: 'Tiempo de Resolución', value: '< 2.4s' },
      { label: 'Precisión Anti-Fraude', value: '99.94%' },
      { label: 'Ahorro Operativo', value: '-62%' },
    ],
    agents: ['Agente de Scoring de Riesgo', 'Validador KYC Biométrico', 'Conciliador de Libros Diarios'],
    codeSnippet: `const riskAgent = await nexo.agents.deploy({
  role: 'compliance-auditor',
  tier: 'bank-grade',
  rules: ['AML_KYC_v4', 'ISO_20022'],
  maxLatencyMs: 15
});`,
  },
  {
    id: 'retail',
    name: 'Retail & E-Commerce',
    badge: 'Comercio Conversacional',
    icon: ShoppingBag,
    headline: 'Agentes de Venta Consultiva 24/7 y Carritos Predictivos',
    description: 'Transforma visitantes en compradores recurrentes con recomendaciones impulsadas por búsqueda vectorial y cierre de ventas guiado.',
    kpis: [
      { label: 'Conversión de Checkout', value: '+44%' },
      { label: 'Ticket Promedio (AOV)', value: '+28%' },
      { label: 'Resolución de Soporte', value: '88% Sin Humanos' },
    ],
    agents: ['Agente Vendedor Consultivo', 'Recomendador Vectorial', 'Recuperador de Carritos'],
    codeSnippet: `const retailAgent = await nexo.agents.deploy({
  role: 'commerce-concierge',
  channels: ['web', 'whatsapp', 'instagram'],
  knowledgeBase: 'catalog_vector_index',
  currency: 'USD'
});`,
  },
  {
    id: 'logistics',
    name: 'Logística & Cadena 4.0',
    badge: 'Operaciones Críticas',
    icon: Truck,
    headline: 'Sincronización Autónoma de Stock y Ruteo Dinámico',
    description: 'Predice cuellos de botella en la cadena de suministro, automatiza órdenes de reabastecimiento y optimiza rutas de última milla.',
    kpis: [
      { label: 'Reducción de Quiebres de Stock', value: '-82%' },
      { label: 'Optimización de Rutas', value: '+35% Eficiencia' },
      { label: 'Velocidad de Despacho', value: '4x más rápido' },
    ],
    agents: ['Orquestador de Inventario', 'Predictor de Rutas Dinámicas', 'Auditor de Facturación Logística'],
    codeSnippet: `const supplyAgent = await nexo.agents.deploy({
  role: 'fleet-optimizer',
  telemetry: 'live_iot_streams',
  predictionWindow: '72_hours',
  reorderThreshold: 'smart_dynamic'
});`,
  },
  {
    id: 'health',
    name: 'Salud & HealthTech',
    badge: 'Cumplimiento HIPAA',
    icon: HeartPulse,
    headline: 'Triaje Clínico Automatizado y Agendamiento Quirúrgico',
    description: 'Agentes entrenados para clasificar urgencias, sincronizar historiales médicos cifrados y gestionar turnos clínicos sin demoras.',
    kpis: [
      { label: 'Tiempo de Espera', value: '-70%' },
      { label: 'Satisfacción del Paciente', value: '98.5%' },
      { label: 'Cumplimiento HIPAA / GDPR', value: '100% Cifrado' },
    ],
    agents: ['Agente de Triaje Inicial', 'Coordinador de Quirófanos', 'Asistente de Recetas & Farmacia'],
    codeSnippet: `const healthAgent = await nexo.agents.deploy({
  role: 'clinical-intake',
  compliance: ['HIPAA', 'HL7_FHIR'],
  dataIsolation: 'dedicated_tenant_vault'
});`,
  },
];

export default function SolucionesTabs() {
  const [activeTab, setActiveTab] = useState(industries[0].id);
  const currentIndustry = industries.find((i) => i.id === activeTab) || industries[0];

  return (
    <section id="industrias" className="py-24 px-6 max-w-7xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springTransition}
        className="text-center max-w-3xl mx-auto mb-14"
      >
        <span className="text-xs uppercase tracking-widest text-[#22E6D6] font-bold px-3 py-1.5 rounded-full border border-[#22E6D6]/30 bg-[#22E6D6]/10 inline-block mb-4 shadow-[0_0_15px_rgba(34,230,214,0.15)]">
          Especialización Vertical
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#F3F6FC] tracking-tight">
          Soluciones diseñadas para{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E6D6] to-blue-400">
            tu sector específico
          </span>
        </h2>
        <p className="mt-4 text-[#8998C2] text-base md:text-lg">
          Selecciona una vertical para explorar los agentes, métricas de retorno de inversión e integraciones pre-configuradas.
        </p>
      </motion.div>

      {/* Tabs Selector estilo 21st.dev con layoutId para transición suave */}
      <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-[#0A1730]/70 border border-white/10 backdrop-blur-xl max-w-3xl mx-auto mb-10">
        {industries.map((ind) => {
          const isActive = activeTab === ind.id;
          const Icon = ind.icon;
          return (
            <button
              key={ind.id}
              onClick={() => setActiveTab(ind.id)}
              className={`relative px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2.5 z-10 ${
                isActive ? 'text-[#050B1F]' : 'text-[#8998C2] hover:text-[#F3F6FC]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndustryPill"
                  transition={springTransition}
                  className="absolute inset-0 bg-gradient-to-r from-[#22E6D6] to-cyan-300 rounded-xl -z-10 shadow-[0_0_20px_rgba(34,230,214,0.4)]"
                />
              )}
              <Icon className="w-4 h-4" />
              <span>{ind.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de Contenido Dinámico con AnimatePresence (sin saltos de layout) */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndustry.id}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={springTransition}
            className="rounded-3xl border border-white/15 bg-[#0A1730]/85 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_50px_-15px_rgba(5,11,31,0.9)] hover:border-[#22E6D6]/50 hover:shadow-[0_25px_60px_-15px_rgba(34,230,214,0.2)] transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#22E6D6]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Información y KPIs */}
              <div className="lg:col-span-7">
                <span className="text-xs uppercase font-bold tracking-widest text-[#22E6D6] mb-3 inline-block">
                  {currentIndustry.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F3F6FC] tracking-tight leading-snug mb-4">
                  {currentIndustry.headline}
                </h3>
                <p className="text-[#8998C2] text-base leading-relaxed mb-8">
                  {currentIndustry.description}
                </p>

                {/* Métricas / KPIs */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {currentIndustry.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#050B1F]/60 border border-white/5 text-center"
                    >
                      <div className="text-xl sm:text-2xl font-black text-[#22E6D6]">{kpi.value}</div>
                      <div className="text-[11px] text-[#8998C2] mt-1 font-medium">{kpi.label}</div>
                    </div>
                  ))}
                </div>

                {/* Agentes Autónomos Incluidos */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#8998C2]">
                    Agentes Especializados Incluidos:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentIndustry.agents.map((ag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22E6D6]/10 border border-[#22E6D6]/20 text-[#F3F6FC] text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22E6D6]" />
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visor de Código / Despliegue */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-[#050B1F] p-5 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#22E6D6]" />
                      <span className="text-xs font-mono text-[#8998C2]">deploy-agent.ts</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                  </div>
                  <pre className="font-mono text-xs text-[#22E6D6] overflow-x-auto p-2 leading-relaxed selection:bg-[#22E6D6]/30">
                    <code>{currentIndustry.codeSnippet}</code>
                  </pre>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8998C2]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Despliegue Serverless en Edge
                    </span>
                    <span className="text-[#22E6D6] font-mono">Status: Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
