'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Utensils, Footprints, Wrench, Scissors, 
  Stethoscope, Briefcase, CheckCircle2, ArrowRight, Sparkles, type LucideIcon
} from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

interface SectorItem {
  id: string;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  badge: string;
  soluciones: string[];
  beneficioPrincipal: string;
  flujoEjemplo: string;
}

const sectores: SectorItem[] = [
  {
    id: 'tiendas',
    name: 'Tiendas & Retail',
    subtitle: 'Abarrotes, Ropa, Boutiques y Tiendas de Conveniencia',
    icon: Store,
    badge: 'Comercio Local',
    soluciones: [
      'Catálogo interactivo digital conectado a WhatsApp Business',
      'Consulta instantánea de stock y disponibilidad de productos',
      'Registro automático de compras y balance de caja al día',
      'Alertas inteligentes de reposición antes de agotar existencia',
    ],
    beneficioPrincipal: '+32% ventas cerradas en horarios no comerciales.',
    flujoEjemplo: 'El cliente pregunta por disponibilidad a las 11 PM por WhatsApp; el agente responde, envía fotos, toma la orden y aparta el producto.',
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes & Cafeterías',
    subtitle: 'Pizzerías, Cafés, Dark Kitchens y Comida Rápida',
    icon: Utensils,
    badge: 'Alimentos & Bebidas',
    soluciones: [
      'Toma de pedidos y comandas automatizadas sin comisiones de apps externas',
      'Envío dinámico de menú interactivo con fotos y complementos',
      'Reservación de mesas y confirmación instantánea por WhatsApp',
      'Control de mermas e insumos perecederos para proteger tu margen neto',
    ],
    beneficioPrincipal: '0% comisiones abusivas a plataformas intermediarias.',
    flujoEjemplo: 'El comensal pide una pizza con ingredientes extra vía chat; el agente confirma domicilio, calcula total y envía la comanda directo a cocina.',
  },
  {
    id: 'zapaterias',
    name: 'Zapaterías & Calzado',
    subtitle: 'Calzado Formal, Tenis, Sandalias y Boutiques',
    icon: Footprints,
    badge: 'Moda & Calzado',
    soluciones: [
      'Consulta inmediata de modelos, colores y tallas exactas disponibles',
      'Sistema de apartado y reservación de pares en tienda física',
      'Seguimiento post-venta y sugerencias de productos complementarios',
      'Notificaciones automáticas a clientes cuando llega nuevo calzado',
    ],
    beneficioPrincipal: 'Elimina el "déjame ir a bodega a ver si hay tu talla".',
    flujoEjemplo: 'Un comprador envía la foto de un zapato y pide talla 27; la IA consulta el inventario en milisegundos y confirma disponibilidad en tienda.',
  },
  {
    id: 'ferreterias',
    name: 'Ferreterías & Materiales',
    subtitle: 'Ferreterías, Tlapalerías y Venta de Materiales',
    icon: Wrench,
    badge: 'Construcción & Hogar',
    soluciones: [
      'Cotizador veloz de listas de materiales y herramientas vía WhatsApp',
      'Cálculo de bultos de cemento, varillas o pintura por metros cuadrados',
      'Órdenes prioritarias y cuentas por cobrar para maestros de obra',
      'Actualización inmediata de listas de precios de múltiples proveedores',
    ],
    beneficioPrincipal: 'Cotizaciones complejas resueltas en menos de 1 minuto.',
    flujoEjemplo: 'Un contratista manda una lista desordenada de 15 materiales; la IA la organiza, cotiza los precios vigentes y genera la orden de entrega.',
  },
  {
    id: 'esteticas',
    name: 'Estéticas & Spas',
    subtitle: 'Salones de Belleza, Barberías, Spas y Cuidado de Uñas',
    icon: Scissors,
    badge: 'Belleza & Bienestar',
    soluciones: [
      'Agenda automatizada 24/7 de citas según el estilista y horario libre',
      'Recordatorios automáticos por WhatsApp para reducir ausencias y plantones',
      'Catálogo de servicios, tratamientos y paquetes especiales',
      'Reactivación de clientes inactivos tras 30 o 45 días sin cita',
    ],
    beneficioPrincipal: 'Reduce hasta un 75% las cancelaciones y citas olvidadas.',
    flujoEjemplo: 'La clienta solicita cita de tinte y corte el sábado a las 4 PM; la IA verifica la agenda de su estilista favorita y confirma el apartado.',
  },
  {
    id: 'consultorios',
    name: 'Consultorios & Clínicas',
    subtitle: 'Médicos, Dentales, Nutrición, Psicología y Fisioterapia',
    icon: Stethoscope,
    badge: 'Salud & Cuidado',
    soluciones: [
      'Triaje inicial y recepción guiada de motivo de consulta',
      'Agendamiento y confirmación de citas con recordatorios puntuales',
      'Envío automático de instrucciones previas a estudios o análisis',
      'Atención de preguntas frecuentes sobre horarios, ubicación y seguros',
    ],
    beneficioPrincipal: 'Recepción ordenada sin saturar la línea telefónica.',
    flujoEjemplo: 'Un paciente necesita consulta de valoración; el agente le muestra la disponibilidad médica, solicita datos esenciales y envía la ubicación.',
  },
  {
    id: 'servicios',
    name: 'Empresas de Servicios',
    subtitle: 'Talleres Mecánicos, Climas, Despachos y Mantenimiento',
    icon: Briefcase,
    badge: 'Servicios Profesionales',
    soluciones: [
      'Levantamiento de órdenes de servicio y reporte de fallas por chat',
      'Consulta en tiempo real del estatus de avance de una reparación',
      'Envío de presupuestos de mano de obra y refacciones con aprobación digital',
      'Control de citas y visitas técnicas a domicilio',
    ],
    beneficioPrincipal: 'Transparencia y certidumbre total para tus clientes.',
    flujoEjemplo: 'El cliente pregunta "¿ya quedó listo mi auto?"; el bot consulta el folio de servicio en la base de datos y le informa el estado del diagnóstico.',
  },
];

export default function ParaQuienEs() {
  const [selectedSector, setSelectedSector] = useState(sectores[0].id);
  const activeSector = sectores.find((s) => s.id === selectedSector) || sectores[0];

  const handleOpenDiag = () => {
    const event = new CustomEvent('open-diagnostico');
    window.dispatchEvent(event);
  };

  return (
    <section id="para-quien" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Resplandor decorativo */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Cabecera */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springTransition}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 inline-block mb-4 shadow-[0_0_20px_rgba(34,230,214,0.15)]">
          Giro a Giro
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
          ¿Para quién es{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400">
            NEXO.IA?
          </span>
        </h2>
        <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
          Nuestras soluciones de inteligencia artificial automatizada están calibradas para resolver los desafíos cotidianos de los negocios reales.
        </p>
      </motion.div>

      {/* Selector de Categorías (Pestañas estilo SaaS) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        {sectores.map((sec) => {
          const Icon = sec.icon;
          const isActive = sec.id === selectedSector;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_25px_rgba(34,230,214,0.35)] scale-105'
                  : 'bg-slate-900/70 border border-slate-700/70 text-slate-300 hover:text-white hover:border-cyan-400/40 hover:bg-slate-800/80 backdrop-blur-md'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{sec.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de Detalle del Sector Seleccionado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSector.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={springTransition}
          className="p-8 sm:p-10 rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Información del Sector */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  <activeSector.icon className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block">
                    {activeSector.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activeSector.name}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {activeSector.subtitle}
              </p>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                  Automatizaciones implementadas en este giro:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSector.soluciones.map((sol, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{sol}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleOpenDiag}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(34,230,214,0.35)] hover:shadow-[0_0_35px_rgba(34,230,214,0.55)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Diagnosticar mi {activeSector.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tarjeta de Demostración del Caso de Uso */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl border border-cyan-400/30 bg-slate-950/70 backdrop-blur-md shadow-inner space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Simulación de Flujo en Vivo
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    24/7 Activo
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  <strong className="text-cyan-300 block mb-1">Caso de uso real:</strong>
                  {activeSector.flujoEjemplo}
                </div>

                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block mb-0.5">
                    Impacto Clave:
                  </span>
                  <span className="text-xs font-semibold text-slate-100">
                    {activeSector.beneficioPrincipal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cuadrícula Resumida de las 7 Categorías */}
      <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {sectores.map((sec) => {
          const Icon = sec.icon;
          const isSelected = sec.id === selectedSector;
          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(34,230,214,0.2)]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
              <span className="text-xs font-bold leading-tight line-clamp-1">{sec.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
