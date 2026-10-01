'use client';

import React from 'react';
import Navbar from '@/src/components/landing/Navbar';
import Hero from '@/src/components/landing/Hero';
import AcercaDeNosotros from '@/src/components/landing/AcercaDeNosotros';
import ParaQuienEs from '@/src/components/landing/ParaQuienEs';
import BentoGrid from '@/src/components/landing/BentoGrid';
import Soluciones3D from '@/src/components/Soluciones3D';
import SolucionesTabs from '@/src/components/landing/SolucionesTabs';
import ContactoValladolid from '@/src/components/landing/ContactoValladolid';
import FAQ from '@/src/components/landing/FAQ';
import Footer from '@/src/components/landing/Footer';
import DiagnosticoFlowModal from '@/src/components/diagnostic/DiagnosticoFlowModal';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-400 selection:text-slate-950 font-sans antialiased overflow-x-hidden bg-slate-950">
      {/* =========================================================================
          FONDO PRINCIPAL CON hero-bg.jpg (PANTALLA COMPLETA, COBERTURA TOTAL Y EFECTO FIJO)
          Overlay refinado SaaS con gradiente en tonos slate/zinc para máxima legibilidad y estética limpia
         ========================================================================= */}
      <div className="fixed inset-0 -z-50 pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed">
        <Image
          src="/images/hero-bg.jpg"
          alt="NEXO.IA Core Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Capa SaaS suave: tonos slate profundos que suavizan los contrastes y otorgan aspecto premium */}
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/90" />
      </div>

      {/* Barra de Navegación Glassmorphic */}
      <Navbar />

      <main className="relative z-10">
        {/* Sección Hero con Microinteracciones & Telemetría */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Hero />
        </motion.section>

        {/* Sección "Acerca de Nosotros": Consultoría de IA para PyMEs y Misión/Visión */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <AcercaDeNosotros />
        </motion.div>

        {/* Sección "¿Para quién es NEXO.IA?": Categorías de impacto (Tiendas, Restaurantes, etc.) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <ParaQuienEs />
        </motion.div>

        {/* Bento Grid con Flujos Automatizados */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <BentoGrid />
        </motion.div>

        {/* Metodología Paso a Paso Pyme con Escena e Imágenes Originales */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <Soluciones3D />
        </motion.div>

        {/* Pestañas de Especialización Vertical por Industria */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <SolucionesTabs />
        </motion.div>

        {/* Sección de Contacto y Sede Regional Valladolid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <ContactoValladolid />
        </motion.div>

        {/* Acordeón de Preguntas Frecuentes con Framer Motion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <FAQ />
        </motion.div>
      </main>

      {/* Footer y Banner de Conversión Final */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={sectionVariants}
      >
        <Footer />
      </motion.div>

      {/* Modal Integral de Diagnóstico, Registro Supabase y Estimador de Precios */}
      <DiagnosticoFlowModal />
    </div>
  );
}
