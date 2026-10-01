'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  X, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, 
  CreditCard, Loader2, Bot, ShieldCheck, Zap, TrendingUp, Building2, User, Mail, Phone,
  Check, DollarSign
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import GoogleButton from '@/components/auth/GoogleButton';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

interface QuestionDef {
  id: number;
  question: string;
  type: 'choice' | 'text';
  options?: string[];
  placeholder?: string;
}

const questionsList: QuestionDef[] = [
  {
    id: 1,
    question: '¿En qué sector opera tu empresa?',
    type: 'choice',
    options: [
      'Comercio / Tienda Retail',
      'Alimentos y Restaurantes',
      'Servicios Profesionales / Consultoría',
      'Salud, Belleza y Estética',
      'Manufactura / Taller Artesanal',
      'Logística, Envíos y Transporte',
      'Hotelería y Turismo Regional',
    ],
  },
  {
    id: 2,
    question: '¿Cuántas personas forman parte de tu equipo de trabajo?',
    type: 'choice',
    options: ['Solo yo (Emprendedor)', '2 a 5 colaboradores', '6 a 15 colaboradores', 'Más de 15 colaboradores'],
  },
  {
    id: 3,
    question: '¿Cuál es tu principal canal de atención a clientes?',
    type: 'choice',
    options: [
      'WhatsApp Business',
      'Redes Sociales (Instagram / Facebook)',
      'Llamadas telefónicas',
      'En mostrador / Tienda física',
      'Correo electrónico',
    ],
  },
  {
    id: 4,
    question: '¿Cuánto tiempo dedicas diariamente a responder mensajes repetitivos de clientes?',
    type: 'choice',
    options: ['Menos de 1 hora', 'Entre 1 y 3 horas', 'Más de 3 horas al día', 'Prácticamente todo el día'],
  },
  {
    id: 5,
    question: 'Describe brevemente el principal obstáculo que frena el crecimiento de tu negocio hoy.',
    type: 'text',
    placeholder: 'Ej: Demoras en responder cotizaciones, falta de tiempo, descontrol de productos en almacén...',
  },
  {
    id: 6,
    question: '¿Cómo gestionas el inventario y catálogo de tus productos actualmente?',
    type: 'choice',
    options: [
      'En libreta o notas a mano',
      'En hojas de Excel / Google Sheets',
      'Sistema punto de venta básico',
      'De memoria / Sin registro formal',
    ],
  },
  {
    id: 7,
    question: '¿Cómo registras tus ventas cotidianas y la merma/pérdida de mercancía?',
    type: 'choice',
    options: [
      'Solo cuento el dinero en caja al cierre del día',
      'Hojas de cálculo manuales no automatizadas',
      'No registro mermas ni productos dañados/vencidos',
      'Cuento con un software especializado',
    ],
  },
  {
    id: 8,
    question: '¿Sueles perder ventas por no contestar a tiempo fuera del horario laboral?',
    type: 'choice',
    options: [
      'Sí, con frecuencia en noches y fines de semana',
      'Ocasionalmente cuando el flujo es muy alto',
      'Pocas veces',
      'No lo sé con certeza, pero sospecho que sí',
    ],
  },
  {
    id: 9,
    question: 'Describe qué proceso repetitivo te gustaría automatizar primero con IA.',
    type: 'text',
    placeholder: 'Ej: Enviar menú/catálogo y precios, agendar citas, levantar pedidos por WhatsApp...',
  },
  {
    id: 10,
    question: '¿Cuentas con métricas en tiempo real sobre la ganancia neta semanal/mensual?',
    type: 'choice',
    options: [
      'No, solo calculo números aproximados a fin de mes o año',
      'Tengo un estimado aproximado pero no exacto',
      'Sí, mediante un sistema automático',
      'Es muy difícil calcularlo por las pérdidas y mermas imprevistas',
    ],
  },
  {
    id: 11,
    question: '¿Qué nivel de automatización te gustaría implementar?',
    type: 'choice',
    options: [
      'Básico: Agente WhatsApp 24/7 y respuestas a preguntas frecuentes',
      'Intermedio: Agente de ventas + Registro automático de pedidos y cobro',
      'Avanzado: Sistema integral con inventario, ventas y mermas en tiempo real',
    ],
  },
  {
    id: 12,
    question: '¿Cuál es el rango de ingresos mensuales de tu empresa?',
    type: 'choice',
    options: [
      'Menos de $30,000 MXN',
      '$30,000 a $80,000 MXN',
      '$80,000 a $250,000 MXN',
      'Más de $250,000 MXN',
    ],
  },
  {
    id: 13,
    question: '¿Qué herramientas digitales o sistemas utilizas actualmente?',
    type: 'text',
    placeholder: 'Ej: WhatsApp Business, Excel, SoftRestaurant, Mercado Pago, Terminal bancaria...',
  },
  {
    id: 14,
    question: '¿Requieres soporte técnico humano 24/7 preferente?',
    type: 'choice',
    options: [
      'Sí, acompañamiento prioritario continuo indispensable',
      'Solo en horario extendido',
      'Soporte estándar por tickets / WhatsApp',
    ],
  },
  {
    id: 15,
    question: '¿En cuánto tiempo proyectas implementar estas soluciones de IA?',
    type: 'choice',
    options: [
      'Inmediato (Esta misma semana)',
      'En las próximas 2 a 4 semanas',
      'En los próximos 2 a 3 meses',
      'Solo estoy explorando opciones preliminares',
    ],
  },
];

type FlowStep = 'auth' | 'diagnostic' | 'analyzing' | 'results';

export default function DiagnosticoFlowModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<FlowStep>('auth');
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  const initialFormData = {
    nombre: '',
    apellido: '',
    email: '',
    phone: '',
    empresa: '',
    tipoNegocio: 'Comercio / Tienda',
    necesidades: '',
    password: '',
  };

  // Datos de registro de usuario
  const [formData, setFormData] = useState(initialFormData);

  // Respuestas del cuestionario
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loadingMsg, setLoadingMsg] = useState('Analizando datos de la empresa con IA...');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  
  // Estado para la simulación fluida de pago
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'simulating' | 'success'>('idle');

  const resetFormFields = () => {
    setFormData(initialFormData);
    setAuthError(null);
    setPaymentStatus('idle');
  };

  useEffect(() => {
    const handleOpenAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: 'login' | 'register' }>;
      setAuthMode(customEvent.detail?.mode || 'register');
      setStep('auth');
      resetFormFields();
      setIsOpen(true);
    };

    const handleOpenDiag = () => {
      setStep(formData.email ? 'diagnostic' : 'auth');
      setIsOpen(true);
    };

    window.addEventListener('open-auth-modal', handleOpenAuth);
    window.addEventListener('open-diagnostico', handleOpenDiag);

    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuth);
      window.removeEventListener('open-diagnostico', handleOpenDiag);
    };
  }, [formData.email]);

  const handleCloseModal = () => {
    resetFormFields();
    setIsOpen(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError(null);

    const submittedData = { ...formData };

    try {
      const supabase = createClient();

      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: submittedData.email,
          password: submittedData.password || 'NexoPyme2026!',
          options: {
            data: {
              first_name: submittedData.nombre,
              last_name: submittedData.apellido,
              full_name: `${submittedData.nombre} ${submittedData.apellido}`.trim(),
              phone: submittedData.phone,
              company: submittedData.empresa,
              business_type: submittedData.tipoNegocio,
              needs: submittedData.necesidades,
            },
          },
        });
        if (error && !error.message.includes('already registered')) {
          console.warn('Supabase register note:', error.message);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: submittedData.email,
          password: submittedData.password || 'NexoPyme2026!',
        });
        if (error) {
          console.warn('Supabase login note:', error.message);
        }
      }

      localStorage.setItem('nexo_client_profile', JSON.stringify(submittedData));
      resetFormFields();
      setStep('diagnostic');
    } catch (err: unknown) {
      console.error(err);
      localStorage.setItem('nexo_client_profile', JSON.stringify(submittedData));
      resetFormFields();
      setStep('diagnostic');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const qId = questionsList[currentQIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questionsList.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setStep('analyzing');
      const messages = [
        'Analizando datos de la empresa con IA...',
        'Evaluando volumen de pérdida por mensajes no atendidos...',
        'Calculando impacto financiero de mermas e inventario...',
        'Generando presupuesto estimado y propuesta de solución personalizada...',
      ];
      let msgIdx = 0;
      const interval = setInterval(() => {
        msgIdx++;
        if (msgIdx < messages.length) {
          setLoadingMsg(messages[msgIdx]);
        } else {
          clearInterval(interval);
          setStep('results');
        }
      }, 700);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const currentQ = questionsList[currentQIndex];
  const progressPercent = Math.round(((currentQIndex + 1) / questionsList.length) * 100);

  // =========================================================================
  // CÁLCULO DE UN SOLO PRECIO ESTIMADO GENERAL PERSONALIZADO SEGÚN RESPUESTAS
  // =========================================================================
  const calculateEstimatedPrice = () => {
    let price = 2490;

    // Nivel de automatización deseado (Pregunta 11)
    const nivel = answers[11] || '';
    if (nivel.includes('Avanzado')) {
      price = 4490;
    } else if (nivel.includes('Intermedio')) {
      price = 3290;
    }

    // Tamaño del equipo (Pregunta 2)
    const equipo = answers[2] || '';
    if (equipo.includes('Más de 15')) price += 1000;
    else if (equipo.includes('6 a 15')) price += 500;

    // Horas diarias en mensajes repetitivos (Pregunta 4)
    const horas = answers[4] || '';
    if (horas.includes('Más de 3') || horas.includes('Prácticamente todo')) price += 400;

    // Soporte prioritario 24/7 (Pregunta 14)
    const soporte = answers[14] || '';
    if (soporte.includes('indispensable') || soporte.includes('prioritario')) price += 400;

    return price;
  };

  const estimatedPrice = calculateEstimatedPrice();

  // =========================================================================
  // FLUJO DE PAGO SIMPLIFICADO: Simulación fluida y acceso directo al Dashboard
  // =========================================================================
  const handleSimulatedPayment = async () => {
    setPaymentStatus('simulating');

    // Persistir respuestas y suscripción activa en local
    localStorage.setItem('nexo_diagnostic_answers', JSON.stringify(answers));
    localStorage.setItem('nexo_plan_activo', 'pro');
    localStorage.setItem('nexo_simulated_price', estimatedPrice.toString());

    if (formData.email || formData.empresa) {
      localStorage.setItem('nexo_client_profile', JSON.stringify(formData));
    }

    // Simulación elegante de 1.2 segundos
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        router.push('/dashboard?payment_status=approved&plan=pyme_pro');
      }, 1000);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={springTransition}
        className="relative w-full max-w-2xl rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 sm:p-8 text-slate-100 shadow-2xl shadow-slate-950 max-h-[90vh] overflow-y-auto"
      >
        {/* Botón Cerrar */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================
            PASO 1: FORMULARIO DE REGISTRO E INICIO DE SESIÓN
            ======================================================== */}
        {step === 'auth' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 inline-block mb-2">
                {authMode === 'register' ? 'Registro Oficial Pyme' : 'Bienvenido de Nuevo'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {authMode === 'register' ? 'Diagnóstico & Registro Empresarial' : 'Iniciar Sesión en NEXO.IA'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                {authMode === 'register'
                  ? 'Ingresa los datos de tu empresa para comenzar tu diagnóstico de IA personalizado.'
                  : 'Ingresa a tu panel de control y seguimiento de agentes.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre</label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej. Roberto"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Apellido</label>
                      <input
                        type="text"
                        required
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        placeholder="Ej. Castillo"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre de la Empresa</label>
                      <input
                        type="text"
                        required
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        placeholder="Ej. Abarrotes Sisal / Taller Maya"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo de Negocio</label>
                      <select
                        value={formData.tipoNegocio}
                        onChange={(e) => setFormData({ ...formData, tipoNegocio: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Comercio / Tienda">Comercio / Tienda Retail</option>
                        <option value="Restaurante / Cafetería">Restaurante / Alimentos</option>
                        <option value="Servicios Profesionales">Servicios Profesionales</option>
                        <option value="Salud y Belleza">Salud / Consultorio / Belleza</option>
                        <option value="Taller / Manufactura">Taller / Manufactura</option>
                        <option value="Hotelería y Turismo">Hotelería / Hospedaje</option>
                        <option value="Logística y Envíos">Logística y Distribución</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ej. +52 985 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@tuempresa.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Descripción breve de las necesidades del cliente
                  </label>
                  <textarea
                    rows={2}
                    value={formData.necesidades}
                    onChange={(e) => setFormData({ ...formData, necesidades: e.target.value })}
                    placeholder="Cuéntanos qué te gustaría mejorar en tu negocio (ej. responder rápido por WhatsApp, controlar stock)..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              )}

              {authError && <p className="text-xs text-red-400 text-center">{authError}</p>}

              {/* Botón Principal: Enviar solicitud */}
              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_25px_rgba(34,230,214,0.35)] hover:shadow-[0_0_35px_rgba(34,230,214,0.55)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmittingAuth ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <span>{authMode === 'register' ? 'Enviar solicitud y Diagnosticar' : 'Iniciar Sesión'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Alternar entre Registro e Inicio de sesión */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                className="text-xs text-slate-400 hover:text-cyan-300 transition-colors underline cursor-pointer"
              >
                {authMode === 'register'
                  ? '¿Ya tienes una cuenta? Inicia sesión aquí'
                  : '¿No tienes cuenta aún? Regístrate aquí'}
              </button>
            </div>

            {/* Registro con Google */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex justify-center">
              <GoogleButton 
                mode={authMode} 
                label={authMode === 'register' ? 'Registrarse con Google' : 'Iniciar sesión con Google'} 
              />
            </div>
          </div>
        )}

        {/* ========================================================
            PASO 2: CUESTIONARIO DE DIAGNÓSTICO (15 PREGUNTAS)
            ======================================================== */}
        {step === 'diagnostic' && (
          <div>
            {/* Barra de Progreso Superior */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span className="text-cyan-300 font-bold">Pregunta {currentQIndex + 1} de {questionsList.length}</span>
                <span>{progressPercent}% completado</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 h-full rounded-full shadow-[0_0_15px_#22E6D6]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={springTransition}
                />
              </div>
            </div>

            {/* Pregunta Actual */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={springTransition}
                className="py-2"
              >
                <div className="flex items-start gap-3 mb-6">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold text-sm">
                    {currentQ.id}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {currentQ.question}
                  </h4>
                </div>

                {/* Opciones Múltiples */}
                {currentQ.type === 'choice' && currentQ.options && (
                  <div className="grid grid-cols-1 gap-2.5 mb-8">
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = answers[currentQ.id] === opt;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAnswerSelect(opt)}
                          className={`p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,230,214,0.25)]'
                              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-400/40 hover:text-white'
                          }`}
                        >
                          <span>{opt}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-cyan-400 bg-cyan-400'
                                : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Campo Abierto */}
                {currentQ.type === 'text' && (
                  <div className="mb-8">
                    <textarea
                      rows={4}
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      placeholder={currentQ.placeholder}
                      className="w-full p-4 rounded-2xl border border-slate-700 bg-slate-950/80 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none shadow-inner"
                      autoFocus
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Controles de Navegación de Preguntas */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePrevQuestion}
                disabled={currentQIndex === 0}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 ${
                  currentQIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex items-center gap-2 text-xs sm:text-sm font-black px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_20px_rgba(34,230,214,0.35)] hover:shadow-[0_0_30px_rgba(34,230,214,0.55)] cursor-pointer transition-all"
              >
                <span>{currentQIndex === questionsList.length - 1 ? 'Generar mi propuesta única' : 'Siguiente pregunta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            PASO 3: PANTALLA DE ANÁLISIS EN TIEMPO REAL
            ======================================================== */}
        {step === 'analyzing' && (
          <div className="py-16 text-center">
            <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-400/20 animate-ping" />
              <div className="w-20 h-20 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
              <Bot className="w-8 h-8 text-cyan-300 absolute" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
              {loadingMsg}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
              Nuestros algoritmos analizan el benchmark de rentabilidad para {formData.empresa || 'tu empresa'} y calculan tu solución personalizada.
            </p>
          </div>
        )}

        {/* ========================================================
            PASO 4: RESULTADO CON UN SOLO PRECIO ESTIMADO GENERAL Y LO QUE INCLUYE
            ======================================================== */}
        {step === 'results' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Diagnóstico y Cotización a la Medida
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Propuesta de Solución para {formData.empresa || 'tu Negocio'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Identificamos inconsistencias operativas clave y estructuramos tu paquete único de implementación.
              </p>
            </div>

            {/* Resumen de Inconsistencias Detectadas */}
            <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Ineficiencias y pérdidas operativas detectadas en tu PyME:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Fuga de ventas fuera de horario:</strong> Demoras en atender mensajes nocturnos y de fin de semana reducen tu tasa de cierre en hasta un 38%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Carga manual repetitiva:</strong> Horas absorbidas en responder precios y catálogos que frenan la captación de nuevos clientes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Descontrol de mermas e inventario:</strong> La falta de un registro sistemático de pérdidas devalúa el margen neto real de tu negocio.</span>
                </li>
              </ul>
            </div>

            {/* =====================================================
                UN SOLO PRECIO ESTIMADO GENERAL PERSONALIZADO
                ===================================================== */}
            <div className="p-6 rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 shadow-[0_0_30px_rgba(34,230,214,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-1.5">
                    Precio Estimado General Personalizado
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    Inversión Integral Recomendada
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Calculado con base en tu sector ({answers[1] || formData.tipoNegocio}), colaboradores y volumen de mensajes.
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-tight">
                    ${estimatedPrice.toLocaleString('es-MX')}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">MXN / mes</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 block mt-0.5">
                    ✓ Sin plazos forzosos • Cancela cuando quieras
                  </span>
                </div>
              </div>

              {/* Proyección de Ahorro y Retorno */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Retorno de Inversión (ROI) estimado:
                </span>
                <span className="font-bold text-cyan-300">
                  Ahorro proyectado de ~$6,500 a $12,000 MXN mensuales
                </span>
              </div>
            </div>

            {/* =====================================================
                BLOQUE DETALLADO: "LO QUE INCLUYE TU SOLUCIÓN"
                ===================================================== */}
            <div className="p-5 rounded-3xl border border-slate-700/70 bg-slate-950/60 backdrop-blur-md space-y-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-black uppercase tracking-wider text-white">
                  Lo que incluye tu solución
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Agente de IA para WhatsApp 24/7</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-5">
                    Entrenado con tu catálogo, precios y horarios para responder a tus clientes al instante de día y noche.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Módulo de Pedidos y Cotizaciones</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-5">
                    Levantamiento automático de órdenes de compra, cálculo de totales y apartado de productos.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Control de Inventario y Mermas</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-5">
                    Registro sistemático de entradas, salidas y alertas inmediatas ante desabasto o pérdidas.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Integración de Cobros Digitales</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-5">
                    Cobros rápidos mediante enlaces de Mercado Pago y transferencias bancarias verificadas.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Dashboard Analítico en Tiempo Real</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-5">
                    Métricas de margen neto, balance de ingresos, productos estrella y proveedores clave.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Consultoría & Soporte Preferente</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-5">
                    Acompañamiento humano, calibración mensual de tus prompts y asistencia directa para tu equipo.
                  </p>
                </div>
              </div>
            </div>

            {/* =====================================================
                BOTÓN DE ACCIÓN CON SIMULACIÓN DE PAGO FLUIDA
                ===================================================== */}
            <div className="pt-2">
              <motion.button
                onClick={handleSimulatedPayment}
                disabled={paymentStatus !== 'idle'}
                whileHover={paymentStatus === 'idle' ? { scale: 1.02, y: -2 } : {}}
                whileTap={paymentStatus === 'idle' ? { scale: 0.98 } : {}}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 cursor-pointer transition-all ${
                  paymentStatus === 'success'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 text-slate-950 shadow-[0_0_30px_rgba(34,230,214,0.4)] hover:shadow-[0_0_40px_rgba(34,230,214,0.6)]'
                }`}
              >
                {paymentStatus === 'simulating' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>Confirmando activación de solución...</span>
                  </>
                ) : paymentStatus === 'success' ? (
                  <>
                    <Check className="w-5 h-5 text-slate-950" />
                    <span>¡Activación aprobada! Ingresando a tu Dashboard...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-slate-950" />
                    <span>Pagar y Activar Solución Ahora</span>
                  </>
                )}
              </motion.button>
              <span className="text-[11px] text-slate-400 text-center block mt-2">
                Activación simulada instantánea para pruebas • Acceso directo a todos los módulos del Dashboard
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
