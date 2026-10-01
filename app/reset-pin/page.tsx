'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPinPage() {
  const router = useRouter();
  const [nuevoPin, setNuevoPin] = useState('');
  const [confirmarPin, setConfirmarPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Obtener sesión activa resultante de la verificación por correo
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleGuardarPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPin = nuevoPin.trim();
    const cleanConfirm = confirmarPin.trim();

    if (!/^\d{4}$/.test(cleanPin)) {
      setError('El PIN debe contener exactamente 4 dígitos numéricos.');
      return;
    }

    if (cleanPin !== cleanConfirm) {
      setError('Los campos de PIN no coinciden. Verifica que ambos sean iguales.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Guardar en Supabase Auth metadata si está autenticado
      if (user) {
        await supabase.auth.updateUser({
          data: { pin_admin: cleanPin }
        });

        // Intentar actualizar también en tabla empresas si existe
        await supabase
          .from('empresas')
          .update({ pin_admin: cleanPin })
          .eq('user_id', user.id);
      }

      // Persistir localmente para el terminal activo
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexo_admin_pin', cleanPin);
        localStorage.setItem('nexo_modo_rol', 'admin');

        // Registrar en audit logs
        try {
          const rawLogs = localStorage.getItem('nexo_audit_logs');
          const existingLogs = rawLogs ? JSON.parse(rawLogs) : [];
          const ahora = new Date();
          const timestamp = `${ahora.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}, ${ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hs`;

          const nuevoLog = {
            id: `log_${Date.now()}_rst`,
            timestamp,
            usuario: 'Administrador (Vía Email)',
            modulo: 'Seguridad',
            accion: 'PIN Restablecido Exitosamente',
            detalles: 'PIN de Administrador redefinido mediante enlace seguro de recuperación por correo'
          };
          localStorage.setItem('nexo_audit_logs', JSON.stringify([nuevoLog, ...existingLogs]));
        } catch (e) {
          console.error('Error registrando audit log en reset:', e);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard?pinReset=true');
      }, 1500);
    } catch (err: any) {
      console.error('Error al guardar nuevo PIN:', err);
      setError('No se pudo guardar el nuevo PIN. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B1F] flex items-center justify-center p-4 sm:p-6 text-[#F3F6FC] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#22E6D6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0A1730]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(5,11,31,0.95)]">
        {/* Header con logo */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2.5 text-xs text-[#8998C2] hover:text-[#F3F6FC] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22E6D6] animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-[#22E6D6] tracking-wider font-bold">NEXO.IA Auth</span>
          </div>
        </div>

        {/* Icono e información */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#22E6D6]/20 to-cyan-400/20 border border-[#22E6D6]/40 flex items-center justify-center mx-auto mb-4 text-[#22E6D6] shadow-[0_0_25px_rgba(34,230,214,0.25)]">
            <KeyRound className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#F3F6FC] tracking-tight">
            Restablecer PIN de Administrador
          </h1>
          <p className="text-xs text-[#8998C2] mt-2">
            {userEmail ? (
              <>Sesión verificada para <strong className="text-[#22E6D6]">{userEmail}</strong>. Define tu nuevo PIN maestro.</>
            ) : (
              'Ingresa tu nuevo PIN de 4 dígitos para proteger el acceso a tus métricas y restaurar tu cuenta.'
            )}
          </p>
        </div>

        {/* Mensaje de éxito */}
        {success ? (
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-emerald-300">¡PIN actualizado con éxito!</h3>
            <p className="text-xs text-[#8998C2]">
              Tu clave de Administrador ha sido configurada y tus privilegios han sido restablecidos. Redirigiendo al panel...
            </p>
          </div>
        ) : (
          <form onSubmit={handleGuardarPin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#8998C2] block mb-1.5">
                Escribe tu nuevo PIN (4 dígitos)
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                required
                placeholder="••••"
                value={nuevoPin}
                onChange={(e) => {
                  setNuevoPin(e.target.value.replace(/[^0-9]/g, ''));
                  setError(null);
                }}
                className="w-full text-center text-2xl font-mono tracking-[0.5em] px-4 py-3 rounded-xl border border-white/10 bg-[#050B1F] text-[#22E6D6] focus:border-[#22E6D6] focus:outline-none transition-all placeholder:tracking-normal placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8998C2] block mb-1.5">
                Confirma tu nuevo PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="••••"
                value={confirmarPin}
                onChange={(e) => {
                  setConfirmarPin(e.target.value.replace(/[^0-9]/g, ''));
                  setError(null);
                }}
                className="w-full text-center text-2xl font-mono tracking-[0.5em] px-4 py-3 rounded-xl border border-white/10 bg-[#050B1F] text-[#22E6D6] focus:border-[#22E6D6] focus:outline-none transition-all placeholder:tracking-normal placeholder:text-white/20"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || nuevoPin.length !== 4 || confirmarPin.length !== 4}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(34,230,214,0.35)] hover:shadow-[0_0_35px_rgba(34,230,214,0.55)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {loading ? (
                  <span>Guardando...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Guardar y Desbloquear</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-[#8998C2]">
              Al guardar, se activará automáticamente el <strong>Modo Administrador</strong> con acceso completo a métricas, proveedores y ajustes.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
