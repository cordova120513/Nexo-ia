'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, ArrowUpRight, LogIn, UserPlus, Sparkles } from 'lucide-react';

const springTransition = { type: 'spring' as const, stiffness: 260, damping: 20 };

const navLinks = [
  { name: 'Acerca de Nosotros', href: '#acerca-de-nosotros' },
  { name: '¿Para quién?', href: '#para-quien' },
  { name: 'Capacidades', href: '#bento-grid' },
  { name: 'Cómo trabajamos', href: '#como-trabajamos' },
  { name: 'Industrias', href: '#industrias' },
  { name: 'Contacto', href: '#contacto' },
  { name: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode: 'login' | 'register') => {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springTransition}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-slate-800/30'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          {/* Logo: favicon.png oficial con glow cyan al hover */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
            className="relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#22E6D6]/10 border border-[#22E6D6]/30 shadow-[0_0_18px_rgba(34,230,214,0.22)] group-hover:border-[#22E6D6]/70 group-hover:shadow-[0_0_28px_rgba(34,230,214,0.5)] transition-all overflow-hidden"
          >
            <Image
              src="/favicon.png"
              alt="NEXO.IA Logo"
              width={42}
              height={42}
              className="object-contain"
              unoptimized
            />
          </motion.div>

          {/* Brand text + tagline */}
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#F3F6FC] leading-tight">
              NEXO<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22E6D6] to-sky-400">.IA</span>
            </span>
            {/* Separador + tagline oficial */}
            <span className="text-[10px] tracking-widest text-cyan-400/80 uppercase font-bold -mt-0.5 leading-tight">
              CONECTAMOS TU NEGOCIO CON LA INTELIGENCIA.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900/80 p-1.5 backdrop-blur-xl shadow-inner">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
        </nav>

        {/* CTA & Actions: Iniciar Sesión & Registrarse */}
        <div className="hidden sm:flex items-center gap-3">
          <motion.button
            onClick={() => openAuth('login')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={springTransition}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:border-cyan-400/50 hover:bg-slate-800 backdrop-blur-md transition-all shadow-md cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Iniciar sesión</span>
          </motion.button>

          <motion.button
            onClick={() => openAuth('register')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={springTransition}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-300 hover:to-cyan-200 border border-cyan-400 shadow-[0_0_20px_rgba(34,230,214,0.35)] hover:shadow-[0_0_25px_rgba(34,230,214,0.5)] transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-950" />
            <span>Registrarse</span>
          </motion.button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex lg:hidden p-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:text-cyan-400 cursor-pointer"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springTransition}
            className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-6 py-6 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('login');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Iniciar sesión</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('register');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-cyan-400 text-xs font-bold text-slate-950"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Registrarse</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
