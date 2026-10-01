'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Mail, Phone, MessageCircle, Copy, Check, Navigation, Clock, ShieldCheck, Headphones } from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

export default function ContactoValladolid() {
  const [copied, setCopied] = useState(false);
  const email = 'nexo.iavalladolid@gmail.com';
  const whatsappNumber = '+52 983 186 2234';
  const whatsappUrl = 'https://wa.me/529831862234';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contacto" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Resplandor decorativo */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#22E6D6]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#25D366]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Cabecera */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={springTransition}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="text-xs uppercase tracking-widest text-[#22E6D6] font-bold px-3 py-1.5 rounded-full border border-[#22E6D6]/30 bg-[#22E6D6]/10 inline-block mb-4 shadow-[0_0_15px_rgba(34,230,214,0.15)]">
          Presencia Local • Cobertura Nacional
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#F3F6FC] tracking-tight">
          Sede Regional de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E6D6] via-emerald-300 to-green-400">
            Valladolid, Yucatán
          </span>
        </h2>
        <p className="mt-4 text-[#8998C2] text-base md:text-lg">
          Atención presencial y estratégica para empresas de la península de Yucatán, respaldada por agentes inteligentes y tecnología de vanguardia 24/7.
        </p>
      </motion.div>

      {/* =========================================================================
          SECCIÓN PRINCIPAL: MAPA DARK MODE + FOTOGRAFÍA VALLADOLID GLASSMORPHISM
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        {/* Contenedor del Mapa Estilizado en Dark Mode (7 columnas) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.015, y: -4 }}
          transition={springTransition}
          className="lg:col-span-7 rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-950/40 hover:border-cyan-400/60 transition-all relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-400">COORD: 20.6896° N, 88.2017° W</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Hub Regional Activo
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Sede Regional Valladolid
            </h3>
            
            {/* Datos Oficiales de Ubicación y Horario */}
            <div className="space-y-2 mb-5">
              <div className="flex items-start gap-2.5 text-sm text-slate-100">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dirección:</strong> Calle 33 entre 38 y 40, Col. Santa Lucía, Valladolid, Yucatán, México.
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Horario de Atención:</strong> 8:00 AM - 8:00 PM (Lunes a Sábado)
                </span>
              </div>
            </div>
          </div>

          {/* Iframe del Mapa de Google Maps con Estilo Dark Mode */}
          <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-cyan-400/30 shadow-[0_0_25px_rgba(34,230,214,0.15)] bg-slate-950">
            <iframe
              title="Mapa de Sede Valladolid"
              src="https://maps.google.com/maps?q=Calle%2033%20entre%2038%20y%2040,%20Col.%20Santa%20Luc%C3%ADa,%20Valladolid,%20Yucat%C3%A1n,%20M%C3%A9xico&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-[1.15] brightness-[0.92]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Overlay sutil para matizar en la estética dark cyan */}
            <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 rounded-2xl" />
          </div>
        </motion.div>

        {/* Imagen de Valladolid al lado del mapa con Glassmorphism (5 columnas) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ scale: 1.02, y: -4 }}
          transition={springTransition}
          className="lg:col-span-5 rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-950/40 hover:border-cyan-400/60 transition-all relative overflow-hidden group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Identidad & Patrimonio
              </span>
              <span className="text-[11px] font-mono text-slate-400">Pueblo Mágico</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Arquitectura Colonial & Innovación
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
              Desde el corazón de Valladolid, impulsamos a negocios gastronómicos, hoteleros y de comercio con agentes de IA diseñados para el mercado mexicano.
            </p>

            {/* Contenedor Fotográfico con Glassmorphism y Bordes Redondeados */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-cyan-400/30 shadow-[0_0_25px_rgba(34,230,214,0.15)]">
              <Image
                src="/images/VALLADOLID.jpg"
                alt="Sede Regional Valladolid Yucatán"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              {/* Badge Glassmorphism sobre la imagen */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Valladolid, Yucatán</span>
                  <span className="text-cyan-300">México</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">Sede Operativa y Atención a Clientes</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Atención presencial garantizada
            </span>
            <span>Citas programadas</span>
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          BLOQUE DE CANALES DE CONTACTO DIRECTO
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Correo Oficial */}
        <div className="p-6 rounded-2xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Correo Oficial
              </span>
              <a
                href={`mailto:${email}`}
                className="text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors"
              >
                {email}
              </a>
            </div>
          </div>
          <button
            onClick={copyEmail}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all cursor-pointer shrink-0"
            title="Copiar correo"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* WhatsApp Oficial con Enlace Directo */}
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Línea Directa / WhatsApp 24/7
              </span>
              <span className="text-sm sm:text-base font-bold text-white">
                {whatsappNumber}
              </span>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat</span>
          </a>
        </div>
      </div>
    </section>
  );
}
