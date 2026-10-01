'use client';

import React from 'react';
import Navbar from '@/src/components/landing/Navbar';
import Hero from '@/src/components/landing/Hero';
import AcercaDeNosotros from '@/src/components/landing/AcercaDeNosotros';
import ParaQuienEs from '@/src/components/landing/ParaQuienEs';
import BentoGrid from '@/src/components/landing/BentoGrid';
import ComoTrabajamos from '@/src/components/landing/ComoTrabajamos';
import Servicios from '@/src/components/landing/Servicios';
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
      {/* Fondo SaaS Premium: Gradientes sutiles y malla de luz cyan/azul sin edificios corporativos */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-cyan-500/10 via-sky-500/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[35%] -left-[200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-[60%] -right-[200px] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
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

        {/* Sección "¿Cómo trabajamos?": Timeline de 4 pasos con animaciones stagger */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <ComoTrabajamos />
        </motion.div>

        {/* Sección "Servicios": Grid de 6 módulos con métricas y CTA banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={sectionVariants}
        >
          <Servicios />
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
