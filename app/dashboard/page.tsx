'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Sparkles, Settings, Package, TrendingUp, AlertTriangle, BarChart3, 
  PlusCircle, Trash2, Edit3, DollarSign, ArrowUpRight, ArrowDownRight, 
  Calendar, CheckCircle2, LogOut, Menu, X, Save, ShieldCheck, User, 
  Building2, Store, Search, MessageSquare, Headphones, Truck, Filter,
  ArrowUpDown, Upload, Send, Bot, RefreshCw, ChevronRight, Phone, HelpCircle,
  Camera, Lock, Unlock, Copy, Share2, Printer, Check, Clock, AlertCircle, 
  ShoppingCart, FileText, Receipt, Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  AreaChart, Area, Legend, LineChart, Line 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

type TabSection = 'inicio' | 'productos' | 'inventario' | 'ventas' | 'mermas' | 'metricas' | 'proveedores' | 'ajustes';

interface Producto {
  id: string;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
  costo: number;
  stock: number;
  stockMinimo?: number;
  fechaCaducidad?: string;
}

interface Venta {
  id: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  montoTotal: number;
  fecha: string;
  fechaHora?: string;
  periodo: 'dia' | 'semana' | 'mes' | 'ano';
  metodoPago: string;
}

interface Merma {
  id: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  motivo: string;
  costoDevaluacion: number;
  fecha: string;
  fechaHora?: string;
  periodo: 'dia' | 'mes' | 'ano';
}

interface GastoFijo {
  id: string;
  nombre: string;
  monto: number;
  categoria: 'Renta' | 'Luz / Electricidad' | 'Nómina' | 'Internet / Teléfono' | 'Servicios' | 'Otros';
  fecha: string;
}

interface Proveedor {
  id: string;
  nombre: string;
  telefono: string;
  categoriaPaquete: string;
  fechaEntrega: string;
  imagen: string;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}



function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navegación
  const [activeTab, setActiveTab] = useState<TabSection>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Perfil del cliente
  const [profile, setProfile] = useState({
    nombre: 'Usuario Nuevo',
    empresa: 'Mi Pyme',
    email: '',
    phone: '',
    password: '',
    avatar: '',
  });

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const productoImageRef = React.useRef<HTMLInputElement>(null);

  // Datos del negocio (Inicialmente vacíos para usuarios nuevos; se leen de localStorage si existen)
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [mermas, setMermas] = useState<Merma[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [gastosFijos, setGastosFijos] = useState<GastoFijo[]>([]);

  // Control de Roles: Administrador vs Cajero
  const [modoRol, setModoRol] = useState<'admin' | 'cajero'>('admin');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabSection | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [adminPin, setAdminPin] = useState('1234');
  const [nuevoPin, setNuevoPin] = useState('');

  // Estados de interfaz y modales
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [modalOrdenCompraOpen, setModalOrdenCompraOpen] = useState(false);
  const [ordenCopiada, setOrdenCopiada] = useState(false);
  const [promoModal, setPromoModal] = useState<{
    open: boolean;
    producto: Producto | null;
    texto: string;
    loading: boolean;
    descuento: string;
  }>({
    open: false,
    producto: null,
    texto: '',
    loading: false,
    descuento: '20%',
  });
  const [promoCopiada, setPromoCopiada] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Suscripción y Facturación
  const [suscripcionLoading, setSuscripcionLoading] = useState<string | null>(null);
  const [planActivo, setPlanActivo] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexo_plan_activo') || 'basico';
    }
    return 'basico';
  });

  // Filtro y ordenamiento de inventario
  const [inventarioSearch, setInventarioSearch] = useState('');
  const [inventarioOrden, setInventarioOrden] = useState<'az' | 'za' | 'precio-alto' | 'precio-bajo' | 'stock'>('az');

  // Filtro de métricas
  const [filtroMetricaProducto, setFiltroMetricaProducto] = useState<string>('todos');
  const [filtroMetricaPeriodo, setFiltroMetricaPeriodo] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');

  // Formulario Manual de Producto (con Stock Mínimo y Fecha de Caducidad)
  const [productoManual, setProductoManual] = useState({
    nombre: '',
    imagen: '/images/Empresa 1.jpeg',
    categoria: 'General',
    costo: '',
    precio: '',
    stock: '',
    stockMinimo: '5',
    fechaCaducidad: '',
  });

  // Formulario de Gastos Fijos (Renta, Luz, Nómina, etc.)
  const [nuevoGasto, setNuevoGasto] = useState({
    nombre: '',
    monto: '',
    categoria: 'Renta' as GastoFijo['categoria'],
  });

  // Formulario de Venta
  const [nuevaVenta, setNuevaVenta] = useState({
    productoId: '',
    cantidad: '1',
    periodo: 'dia' as 'dia' | 'semana' | 'mes' | 'ano',
    metodoPago: 'WhatsApp / Mercado Pago',
  });

  // Formulario de Merma
  const [nuevaMerma, setNuevaMerma] = useState({
    productoId: '',
    cantidad: '1',
    motivo: 'Caducidad o fecha vencida',
    periodo: 'dia' as 'dia' | 'mes' | 'ano',
  });

  // Formulario de Proveedor
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: '',
    telefono: '',
    categoriaPaquete: '',
    fechaEntrega: '',
    imagen: '/images/Empresa 2.jpeg',
  });

  // Chatbot Gemini
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¿En qué te puedo ayudar hoy? Estoy sincronizado con tu inventario, ventas y mermas para darte asesoría táctica.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Inicialización y carga de datos
  useEffect(() => {
    // Verificar si viene de pago aprobado de Mercado Pago
    const paymentStatus = searchParams.get('payment_status');
    if (paymentStatus === 'approved') {
      setSaveStatus('¡Suscripción confirmada por Mercado Pago! Cuenta 5428780117367250 sincronizada.');
      setTimeout(() => setSaveStatus(null), 6000);
    }

    // Cargar perfil
    const savedProfile = localStorage.getItem('nexo_client_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile((prev) => ({
          ...prev,
          nombre: parsed.nombre || parsed.first_name || prev.nombre,
          empresa: parsed.empresa || parsed.company || prev.empresa,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          avatar: parsed.avatar || prev.avatar,
        }));
      } catch (e) {
        console.error(e);
      }
    }

    // Cargar avatar guardado en localStorage
    const savedAvatar = localStorage.getItem('nexo_user_avatar');
    if (savedAvatar) {
      setProfile((prev) => ({ ...prev, avatar: savedAvatar }));
    }

    // Obtener usuario Supabase si existe
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const meta = user.user_metadata;
        setProfile((prev) => ({
          ...prev,
          nombre: meta?.first_name || meta?.full_name || prev.nombre,
          empresa: meta?.company || prev.empresa,
          email: user.email || prev.email,
        }));
      }
    });

    // Cargar productos de localStorage
    const savedProds = localStorage.getItem('nexo_pyme_productos');
    if (savedProds) {
      try {
        setProductos(JSON.parse(savedProds));
      } catch (e) {
        console.error(e);
      }
    }

    // Cargar ventas
    const savedVentas = localStorage.getItem('nexo_pyme_ventas');
    if (savedVentas) {
      try {
        setVentas(JSON.parse(savedVentas));
      } catch (e) {
        console.error(e);
      }
    }

    // Cargar mermas
    const savedMermas = localStorage.getItem('nexo_pyme_mermas');
    if (savedMermas) {
      try {
        setMermas(JSON.parse(savedMermas));
      } catch (e) {
        console.error(e);
      }
    }

    // Cargar proveedores
    const savedProveedores = localStorage.getItem('nexo_pyme_proveedores');
    if (savedProveedores) {
      try {
        setProveedores(JSON.parse(savedProveedores));
      } catch (e) {
        console.error(e);
      }
    }

    // Cargar gastos fijos
    const savedGastos = localStorage.getItem('nexo_pyme_gastos_fijos');
    if (savedGastos) {
      try {
        setGastosFijos(JSON.parse(savedGastos));
      } catch (e) {
        console.error(e);
      }
    }

    // Cargar PIN y Rol
    const savedPin = localStorage.getItem('nexo_admin_pin');
    if (savedPin) setAdminPin(savedPin);
    const savedRol = localStorage.getItem('nexo_modo_rol') as 'admin' | 'cajero';
    if (savedRol) setModoRol(savedRol);
  }, [searchParams]);

  // Persistir cambios
  const saveProductosToStorage = (items: Producto[]) => {
    setProductos(items);
    localStorage.setItem('nexo_pyme_productos', JSON.stringify(items));
  };

  const saveVentasToStorage = (items: Venta[]) => {
    setVentas(items);
    localStorage.setItem('nexo_pyme_ventas', JSON.stringify(items));
  };

  const saveMermasToStorage = (items: Merma[]) => {
    setMermas(items);
    localStorage.setItem('nexo_pyme_mermas', JSON.stringify(items));
  };

  const saveProveedoresToStorage = (items: Proveedor[]) => {
    setProveedores(items);
    localStorage.setItem('nexo_pyme_proveedores', JSON.stringify(items));
  };

  const saveGastosFijosToStorage = (items: GastoFijo[]) => {
    setGastosFijos(items);
    localStorage.setItem('nexo_pyme_gastos_fijos', JSON.stringify(items));
  };

  // Helper para timestamp exacto legible (ej. "1 de octubre de 2026, 14:35 hs")
  const formatearTimestampCompleto = () => {
    const ahora = new Date();
    return `${ahora.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}, ${ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hs`;
  };

  // Cálculos totales en tiempo real
  const totalIngresos = useMemo(() => ventas.reduce((acc, v) => acc + v.montoTotal, 0), [ventas]);
  const totalMermas = useMemo(() => mermas.reduce((acc, m) => acc + m.costoDevaluacion, 0), [mermas]);
  const balanceNeto = totalIngresos - totalMermas;
  const totalGastosFijos = useMemo(() => gastosFijos.reduce((acc, g) => acc + g.monto, 0), [gastosFijos]);
  const utilidadNetaReal = useMemo(() => balanceNeto - totalGastosFijos, [balanceNeto, totalGastosFijos]);

  // Productos con stock bajo (Reabastecimiento automático)
  const productosBajoStock = useMemo(() => {
    return productos.filter((p) => p.stock <= (p.stockMinimo ?? 5));
  }, [productos]);

  // Alertas preventivas de caducidad (próximos 5 a 7 días)
  const productosProximosVencer = useMemo(() => {
    const hoy = new Date();
    return productos.filter((p) => {
      if (!p.fechaCaducidad) return false;
      const fechaCad = new Date(p.fechaCaducidad + 'T23:59:59');
      const diffTime = fechaCad.getTime() - hoy.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
  }, [productos]);

  // Motor de Venta Cruzada (Cross-Selling en Caja)
  const productosCrossSelling = useMemo(() => {
    if (!nuevaVenta.productoId || productos.length <= 1) return [];
    return productos.filter((p) => p.id !== nuevaVenta.productoId && p.stock > 0).slice(0, 2);
  }, [nuevaVenta.productoId, productos]);

  // Cálculos desglosados por periodo
  const ventasHoy = useMemo(() => {
    return ventas
      .filter((v) => v.periodo === 'dia' || v.fecha.includes('Hoy'))
      .reduce((acc, v) => acc + v.montoTotal, 0);
  }, [ventas]);

  const mermasHoy = useMemo(() => {
    return mermas
      .filter((m) => m.periodo === 'dia' || m.fecha.includes('Hoy'))
      .reduce((acc, m) => acc + m.costoDevaluacion, 0);
  }, [mermas]);

  const gananciasHoy = ventasHoy - mermasHoy;

  // Subida de imagen nativa para productos (FileReader a base64)
  const handleProductoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setSaveStatus('La imagen del producto es demasiado grande. Máximo 4 MB.');
      setTimeout(() => setSaveStatus(null), 3500);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProductoManual((prev) => ({ ...prev, imagen: dataUrl }));
      setSaveStatus('Vista previa de imagen cargada.');
      setTimeout(() => setSaveStatus(null), 2500);
    };
    reader.readAsDataURL(file);
  };

  // Handler para agregar producto manual
  const handleAddProductoManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoManual.nombre || !productoManual.precio) return;

    const nuevo: Producto = {
      id: `prod_${Date.now()}`,
      nombre: productoManual.nombre,
      imagen: productoManual.imagen || '/images/Empresa 1.jpeg',
      categoria: productoManual.categoria || 'General',
      costo: parseFloat(productoManual.costo) || 0,
      precio: parseFloat(productoManual.precio) || 0,
      stock: parseInt(productoManual.stock) || 0,
      stockMinimo: parseInt(productoManual.stockMinimo) || 5,
      fechaCaducidad: productoManual.fechaCaducidad || undefined,
    };

    const updated = [nuevo, ...productos];
    saveProductosToStorage(updated);
    setProductoManual({
      nombre: '',
      imagen: '/images/Empresa 1.jpeg',
      categoria: 'General',
      costo: '',
      precio: '',
      stock: '',
      stockMinimo: '5',
      fechaCaducidad: '',
    });
    setModalProductoOpen(false);
    setSaveStatus(`Producto "${nuevo.nombre}" guardado con éxito.`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handler para registrar venta con marca de tiempo completa
  const handleAddVenta = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = productos.find((p) => p.id === nuevaVenta.productoId) || productos[0];
    if (!prod) return;

    const cant = parseInt(nuevaVenta.cantidad) || 1;
    const total = prod.precio * cant;
    const timestampExacto = formatearTimestampCompleto();

    const ventaItem: Venta = {
      id: `v_${Date.now()}`,
      productoId: prod.id,
      productoNombre: prod.nombre,
      cantidad: cant,
      montoTotal: total,
      fecha: timestampExacto,
      fechaHora: timestampExacto,
      periodo: nuevaVenta.periodo,
      metodoPago: nuevaVenta.metodoPago,
    };

    saveVentasToStorage([ventaItem, ...ventas]);

    // Actualizar inventario
    const updatedProds = productos.map((p) =>
      p.id === prod.id ? { ...p, stock: Math.max(0, p.stock - cant) } : p
    );
    saveProductosToStorage(updatedProds);

    setSaveStatus(`Venta registrada: $${total} MXN (${timestampExacto})`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handler para registrar merma con marca de tiempo completa
  const handleAddMerma = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = productos.find((p) => p.id === nuevaMerma.productoId) || productos[0];
    if (!prod) return;

    const cant = parseInt(nuevaMerma.cantidad) || 1;
    const costoPerdida = prod.costo * cant;
    const timestampExacto = formatearTimestampCompleto();

    const mermaItem: Merma = {
      id: `m_${Date.now()}`,
      productoId: prod.id,
      productoNombre: prod.nombre,
      cantidad: cant,
      motivo: nuevaMerma.motivo,
      costoDevaluacion: costoPerdida,
      fecha: timestampExacto,
      fechaHora: timestampExacto,
      periodo: nuevaMerma.periodo,
    };

    saveMermasToStorage([mermaItem, ...mermas]);

    // Descontar inventario por merma
    const updatedProds = productos.map((p) =>
      p.id === prod.id ? { ...p, stock: Math.max(0, p.stock - cant) } : p
    );
    saveProductosToStorage(updatedProds);

    setSaveStatus(`Merma registrada: - $${costoPerdida} MXN (${timestampExacto})`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handler para registrar gasto fijo operativo
  const handleAddGastoFijo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoGasto.nombre || !nuevoGasto.monto) return;

    const item: GastoFijo = {
      id: `gf_${Date.now()}`,
      nombre: nuevoGasto.nombre,
      monto: parseFloat(nuevoGasto.monto) || 0,
      categoria: nuevoGasto.categoria,
      fecha: formatearTimestampCompleto(),
    };

    saveGastosFijosToStorage([item, ...gastosFijos]);
    setNuevoGasto({
      nombre: '',
      monto: '',
      categoria: 'Renta',
    });
    setSaveStatus(`Gasto operativo "${item.nombre}" ($${item.monto} MXN) registrado.`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handler para cambiar de pestaña con verificación de rol
  const handleTabClick = (tab: TabSection) => {
    const cajeroAllowedTabs: TabSection[] = ['inicio', 'ventas', 'mermas', 'inventario'];
    if (modoRol === 'cajero' && !cajeroAllowedTabs.includes(tab)) {
      setPendingTab(tab);
      setPinInput('');
      setPinError(false);
      setShowPinModal(true);
      return;
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Handler para verificar PIN de Administrador
  const handleVerificarPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === adminPin) {
      setModoRol('admin');
      localStorage.setItem('nexo_modo_rol', 'admin');
      setShowPinModal(false);
      setPinError(false);
      if (pendingTab) {
        setActiveTab(pendingTab);
        setPendingTab(null);
      }
      setSaveStatus('Modo Administrador activado.');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setPinError(true);
    }
  };

  // Handler para cambiar PIN
  const handleCambiarPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoPin.length >= 4) {
      setAdminPin(nuevoPin);
      localStorage.setItem('nexo_admin_pin', nuevoPin);
      setNuevoPin('');
      setSaveStatus('PIN de Administrador actualizado con éxito.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Generador de texto para Orden de Compra Sugerida
  const generarTextoOrdenCompra = () => {
    let texto = `*ORDEN DE COMPRA SUGERIDA*\nEmpresa: *${profile.empresa || 'Mi Negocio'}*\nFecha: ${formatearTimestampCompleto()}\n--------------------------------\n`;
    if (productosBajoStock.length === 0) {
      texto += `Todos los productos cuentan con inventario por encima del stock mínimo.\n`;
    } else {
      texto += `*PRODUCTOS POR REABASTECER (STOCK MÍNIMO ALCANZADO):*\n\n`;
      productosBajoStock.forEach((p, idx) => {
        const sugerido = Math.max(10, ((p.stockMinimo ?? 5) * 2) - p.stock);
        texto += `${idx + 1}. *${p.nombre}* (${p.categoria})\n   • Stock actual: ${p.stock} pzas | Mínimo: ${p.stockMinimo ?? 5}\n   • Cantidad solicitada: *${sugerido} pzas*\n   • Costo estimado unitario: $${p.costo} MXN\n   • Subtotal estimado: $${sugerido * p.costo} MXN\n\n`;
      });
      const totalEstimado = productosBajoStock.reduce((acc, p) => {
        const sugerido = Math.max(10, ((p.stockMinimo ?? 5) * 2) - p.stock);
        return acc + (sugerido * p.costo);
      }, 0);
      texto += `--------------------------------\n*TOTAL ESTIMADO DE LA ORDEN:* $${totalEstimado} MXN\n\n_Generado automáticamente por NEXO.IA Enterprise_`;
    }
    return texto;
  };

  // Generador de Promoción WhatsApp con IA
  const handleGenerarPromoWA = async (prod: Producto, descuento = '20%') => {
    setPromoModal({
      open: true,
      producto: prod,
      texto: '',
      loading: true,
      descuento,
    });
    setPromoCopiada(false);

    try {
      const prompt = `Redacta un mensaje promocional irresistible en texto plano para enviar por WhatsApp a los clientes de mi negocio "${profile.empresa}".
Producto: "${prod.nombre}" (${prod.categoria})
Precio original: $${prod.precio} MXN
Descuento: ${descuento} OFF
Motivo: Promoción relámpago / Oportunidad de inventario
Stock restante: ${prod.stock} unidades.

Instrucciones:
1. Usa emojis llamativos y formato de WhatsApp (negritas con asteriscos *palabra*).
2. Genera sentido de urgencia ("¡Solo hasta agotar existencias!").
3. Incluye llamado a la acción claro para responder directamente al WhatsApp y apartar pedido.
4. Devuelve ÚNICAMENTE el texto listo para enviar.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          systemPrompt: 'Eres un copywriter experto en ventas por WhatsApp para PyMEs en México y Latinoamérica. Redacta únicamente el mensaje comercial listo para copiar y enviar.',
          contextData: {
            empresa: profile.empresa,
            productos: [prod],
          },
        }),
      });
      const data = await res.json();
      setPromoModal((prev) => ({
        ...prev,
        texto: data.content || `🔥 *¡SUPER PROMO EXCLUSIVA EN ${profile.empresa.toUpperCase()}!* 🔥\n\nLleva hoy tu *${prod.nombre}* con *${descuento} de descuento especial*.\nAntes: ~$${prod.precio}~ ➔ *¡Ahora con precio de liquidación!*\n\n🏃‍♂️ ¡Quedan pocas unidades en bodega!\n📲 *Responde a este mensaje para apartar el tuyo antes de que se agoten.*`,
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      setPromoModal((prev) => ({
        ...prev,
        texto: `🔥 *¡SUPER PROMO EN ${profile.empresa.toUpperCase()}!* 🔥\n\nDisfruta de *${prod.nombre}* con un *${descuento} de descuento exclusivo*.\nAntes: $${prod.precio} MXN ➔ ¡Aprovecha hoy mismo!\n\n📲 *Escríbenos directamente a este chat para ordenar el tuyo hoy.*`,
        loading: false,
      }));
    }
  };

  // Handler para registrar proveedor
  const handleAddProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoProveedor.nombre || !nuevoProveedor.telefono) return;

    const item: Proveedor = {
      id: `prov_${Date.now()}`,
      nombre: nuevoProveedor.nombre,
      telefono: nuevoProveedor.telefono,
      categoriaPaquete: nuevoProveedor.categoriaPaquete || 'Insumos Generales',
      fechaEntrega: nuevoProveedor.fechaEntrega || 'Por confirmar',
      imagen: nuevoProveedor.imagen || '/images/Empresa 2.jpeg',
    };

    saveProveedoresToStorage([item, ...proveedores]);
    setNuevoProveedor({
      nombre: '',
      telefono: '',
      categoriaPaquete: '',
      fechaEntrega: '',
      imagen: '/images/Empresa 2.jpeg',
    });
    setSaveStatus(`Proveedor "${item.nombre}" añadido al directorio.`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Handler para guardar perfil/ajustes
  const handleSaveAjustes = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nexo_client_profile', JSON.stringify(profile));
    setSaveStatus('Ajustes y credenciales de la Pyme actualizados.');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Handler para subir avatar (convierte imagen a base64 con FileReader)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setSaveStatus('La imagen es demasiado grande. Máximo 3 MB.');
      setTimeout(() => setSaveStatus(null), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfile((prev) => ({ ...prev, avatar: dataUrl }));
      localStorage.setItem('nexo_user_avatar', dataUrl);
      setSaveStatus('Foto de perfil actualizada correctamente.');
      setTimeout(() => setSaveStatus(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Handler para iniciar checkout con Mercado Pago
  const handleCheckoutMP = async (planId: string, planTitle: string, amount: number) => {
    setSuscripcionLoading(planId);
    try {
      const res = await fetch('/api/mercadopago/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          planTitle,
          amount,
          userEmail: profile.email || 'cliente@nexoia.mx',
          companyName: profile.empresa || 'Pyme',
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        localStorage.setItem('nexo_plan_activo', planId);
        setPlanActivo(planId);
        window.location.href = data.init_point;
      } else {
        setSaveStatus('Error al crear preferencia de pago. Intenta de nuevo.');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('Error de conexión con Mercado Pago. Verifica tu conexión.');
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setSuscripcionLoading(null);
    }
  };

  // Enviar mensaje a Chatbot Gemini
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: chatInput.trim(),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          contextData: {
            empresa: profile.empresa,
            productos,
            totalIngresos,
            totalMermas,
            balanceNeto,
            gastosFijos: totalGastosFijos,
            utilidadNeta: utilidadNetaReal,
            ventas,
            mermas,
            ventasTotalesCount: ventas.length,
            mermasTotalesCount: mermas.length,
          },
        }),
      });

      const data = await response.json();
      const replyMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Sin respuesta del asistente.',
      };

      setChatMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'No se pudo conectar con el servicio en este instante.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Lista de inventario ordenada y filtrada
  const inventarioFiltrado = useMemo(() => {
    let result = productos.filter((p) =>
      p.nombre.toLowerCase().includes(inventarioSearch.toLowerCase()) ||
      p.categoria.toLowerCase().includes(inventarioSearch.toLowerCase())
    );

    if (inventarioOrden === 'az') {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (inventarioOrden === 'za') {
      result.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (inventarioOrden === 'precio-alto') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (inventarioOrden === 'precio-bajo') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (inventarioOrden === 'stock') {
      result.sort((a, b) => b.stock - a.stock);
    }

    return result;
  }, [productos, inventarioSearch, inventarioOrden]);

  // Algoritmo de Estimaciones y Predicciones de IA para los próximos meses
  const datosPrediccionIA = useMemo(() => {
    const baseIngresos = totalIngresos > 0 ? totalIngresos : 4500;
    const factorCrecimiento = Math.max(1.12, 1 + (productos.length * 0.035));
    const factorMermaControl = totalMermas > 0 ? 0.88 : 0.95;

    return [
      { mes: 'Mes Actual', real: totalIngresos, estimado: totalIngresos, mermas: totalMermas },
      { mes: 'Mes +1', estimado: Math.round(baseIngresos * factorCrecimiento), mermas: Math.round(totalMermas * factorMermaControl) },
      { mes: 'Mes +2', estimado: Math.round(baseIngresos * Math.pow(factorCrecimiento, 2)), mermas: Math.round(totalMermas * Math.pow(factorMermaControl, 2)) },
      { mes: 'Mes +3', estimado: Math.round(baseIngresos * Math.pow(factorCrecimiento, 3)), mermas: Math.round(totalMermas * Math.pow(factorMermaControl, 3)) },
      { mes: 'Mes +4', estimado: Math.round(baseIngresos * Math.pow(factorCrecimiento, 4)), mermas: Math.round(totalMermas * Math.pow(factorMermaControl, 4)) },
      { mes: 'Mes +6', estimado: Math.round(baseIngresos * Math.pow(factorCrecimiento, 5.5)), mermas: Math.round(totalMermas * Math.pow(factorMermaControl, 5)) },
    ];
  }, [totalIngresos, totalMermas, productos.length]);

  return (
    <div className="min-h-screen bg-[#050B1F] text-[#F3F6FC] flex flex-col md:flex-row antialiased relative selection:bg-[#22E6D6] selection:text-[#050B1F]">
      {/* ========================================================
          1. MENÚ LATERAL IZQUIERDO (SIDEBAR ENTERPRISE)
          ======================================================== */}
      <aside className="w-full md:w-72 bg-[#0A1730] border-r border-white/10 p-6 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22E6D6]/10 text-[#22E6D6] border border-[#22E6D6]/30 shadow-[0_0_20px_rgba(34,230,214,0.25)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-[#F3F6FC]">
                  NEXO<span className="text-[#22E6D6]">.IA</span>
                </span>
                <span className="text-[10px] text-[#8998C2] font-semibold -mt-1 uppercase tracking-wider">
                  Panel Pyme Enterprise
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-white/10 text-[#8998C2]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Menú de Navegación Vertical */}
          <nav className={`space-y-1.5 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <button
              onClick={() => handleTabClick('inicio')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'inicio'
                  ? 'bg-[#22E6D6]/15 border border-[#22E6D6] text-[#22E6D6] shadow-[0_0_20px_rgba(34,230,214,0.25)]'
                  : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4" />
                <span>Inicio / Bienvenida</span>
              </div>
            </button>

            <button
              onClick={() => handleTabClick('productos')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'productos'
                  ? 'bg-[#22E6D6]/15 border border-[#22E6D6] text-[#22E6D6] shadow-[0_0_20px_rgba(34,230,214,0.25)]'
                  : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Productos / Catálogo</span>
              </div>
            </button>

            <button
              onClick={() => handleTabClick('inventario')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'inventario'
                  ? 'bg-[#22E6D6]/15 border border-[#22E6D6] text-[#22E6D6] shadow-[0_0_20px_rgba(34,230,214,0.25)]'
                  : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ArrowUpDown className="w-4 h-4" />
                <span>Inventario</span>
              </div>
              {productosBajoStock.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-mono">
                  {productosBajoStock.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('ventas')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ventas'
                  ? 'bg-[#22E6D6]/15 border border-[#22E6D6] text-[#22E6D6] shadow-[0_0_20px_rgba(34,230,214,0.25)]'
                  : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4" />
                <span>Ventas Operativas</span>
              </div>
            </button>

            <button
              onClick={() => handleTabClick('mermas')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'mermas'
                  ? 'bg-[#22E6D6]/15 border border-[#22E6D6] text-[#22E6D6] shadow-[0_0_20px_rgba(34,230,214,0.25)]'
                  : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Mermas y Pérdidas</span>
              </div>
            </button>

            <button
              onClick={() => handleTabClick('metricas')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'metricas'
                  ? 'bg-[#22E6D6]/15 border border-[#22E6D6] text-[#22E6D6] shadow-[0_0_20px_rgba(34,230,214,0.25)]'
                  : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Métricas & Gastos</span>
              </div>
              {modoRol === 'cajero' && (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>

            <button
              onClick={() => handleTabClick('proveedores')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'proveedores'
                  ? 'bg-[#22E6D6]/15 border border-[#22E6D6] text-[#22E6D6] shadow-[0_0_20px_rgba(34,230,214,0.25)]'
                  : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span>Proveedores Clave</span>
              </div>
              {modoRol === 'cajero' && (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          </nav>
        </div>

        {/* Parte Inferior: Conmutador de Rol (Admin/Cajero), Rueda de Ajustes y Cierre de Sesión */}
        <div className="pt-4 border-t border-white/10 mt-6 hidden md:block space-y-3">
          {/* Conmutador de Perfil / Rol (Módulo 4) */}
          <div className="p-3 rounded-2xl bg-[#050B1F] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-[#8998C2]">Control de Rol</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                modoRol === 'admin'
                  ? 'bg-[#22E6D6]/15 text-[#22E6D6] border border-[#22E6D6]/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                {modoRol === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {modoRol === 'admin' ? 'Admin' : 'Cajero'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0A1730] rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => {
                  if (modoRol === 'cajero') {
                    setPendingTab(null);
                    setPinInput('');
                    setPinError(false);
                    setShowPinModal(true);
                  }
                }}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  modoRol === 'admin' ? 'bg-[#22E6D6] text-[#050B1F] shadow' : 'text-[#8998C2] hover:text-[#F3F6FC]'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setModoRol('cajero');
                  localStorage.setItem('nexo_modo_rol', 'cajero');
                  if (activeTab === 'metricas' || activeTab === 'proveedores' || activeTab === 'ajustes') {
                    setActiveTab('ventas');
                  }
                  setSaveStatus('Modo Cajero activado. Métricas financieras y ajustes protegidos.');
                  setTimeout(() => setSaveStatus(null), 3000);
                }}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  modoRol === 'cajero' ? 'bg-amber-400 text-[#050B1F] shadow' : 'text-[#8998C2] hover:text-[#F3F6FC]'
                }`}
              >
                Cajero
              </button>
            </div>
          </div>

          <button
            onClick={() => handleTabClick('ajustes')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ajustes'
                ? 'bg-[#22E6D6]/20 border border-[#22E6D6] text-[#22E6D6]'
                : 'text-[#8998C2] hover:bg-white/5 hover:text-[#F3F6FC]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Ajustes de Cuenta</span>
            </div>
            {modoRol === 'cajero' && (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#050B1F]/60 border border-white/5">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#22E6D6]/20 border border-[#22E6D6]/40 flex items-center justify-center font-bold text-xs text-[#22E6D6] shrink-0">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{profile.nombre?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-[#F3F6FC] block truncate">{profile.nombre}</span>
              <span className="text-[10px] text-emerald-400 font-medium block truncate">
                ● {modoRol === 'admin' ? 'Administrador' : 'Cajero Activo'}
              </span>
            </div>
          </div>

          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-xs font-semibold text-[#8998C2] hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. HEADER SUPERIOR Y ÁREA DE CONTENIDO
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Superior del Dashboard */}
        <header className="h-20 bg-[#0A1730]/80 backdrop-blur-md border-b border-white/10 px-6 sm:px-10 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#22E6D6] font-bold">
              {profile.empresa || 'Mi Negocio'}
            </span>
            <span className="text-white/20">•</span>
            {modoRol === 'admin' ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8998C2] font-mono">
                  Balance: <strong className={balanceNeto >= 0 ? 'text-emerald-400' : 'text-red-400'}>${balanceNeto} MXN</strong>
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="text-xs text-[#8998C2] font-mono hidden sm:inline">
                  Utilidad Neta: <strong className={utilidadNetaReal >= 0 ? 'text-cyan-300' : 'text-amber-400'}>${utilidadNetaReal} MXN</strong>
                </span>
              </div>
            ) : (
              <span className="text-xs text-amber-300 font-mono font-medium flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Terminal de Caja
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Botón Superior Derecho: "Ayuda con Chatbot" */}
            <motion.button
              onClick={() => setChatbotOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-extrabold text-xs shadow-[0_0_20px_rgba(34,230,214,0.3)] hover:shadow-[0_0_30px_rgba(34,230,214,0.5)] transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ayuda con Chatbot</span>
            </motion.button>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 text-xs font-semibold text-[#8998C2] hover:text-[#F3F6FC] hover:border-white/25 transition-all"
            >
              <span>Ver Landing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Notificación de Estado */}
        {saveStatus && (
          <div className="mx-6 sm:mx-10 mt-6 p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Contenido Principal Scrollable */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {/* ========================================================
              MÓDULO A: PANTALLA DE BIENVENIDA / INICIO
              (Si el usuario es nuevo y no ha ingresado datos, NO muestra métricas ficticias)
              ======================================================== */}
          {activeTab === 'inicio' && (
            <div className="space-y-8">
              {productos.length === 0 && ventas.length === 0 ? (
                /* Estado Inicial Limpio para Usuario Nuevo */
                <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0A1730] text-center max-w-3xl mx-auto shadow-[0_20px_50px_rgba(5,11,31,0.9)]">
                  <div className="w-16 h-16 rounded-2xl bg-[#22E6D6]/10 text-[#22E6D6] border border-[#22E6D6]/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(34,230,214,0.3)]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#F3F6FC] tracking-tight">
                    Hola, bienvenido {profile.nombre}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[#8998C2] max-w-lg mx-auto">
                    Tu entorno privado de NEXO.IA está listo. Comienza agregando tu primer producto al catálogo o registrando una venta para calibrar tus analíticas predictivas.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('productos')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-bold text-sm shadow-[0_0_25px_rgba(34,230,214,0.4)] cursor-pointer hover:opacity-95 transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Agregar Producto</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('ventas')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 text-[#F3F6FC] font-semibold text-sm hover:border-[#22E6D6]/50 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4 text-[#22E6D6]" />
                      <span>Registrar Primera Venta</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Resumen Dinámico con Datos Reales */
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl border border-white/10 bg-[#0A1730] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#F3F6FC]">
                        Hola, bienvenido {profile.nombre}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#8998C2] mt-1">
                        Empresa activa: <strong className="text-[#22E6D6]">{profile.empresa}</strong> • Resumen operativo en tiempo real.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setModalProductoOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-[#22E6D6] text-[#050B1F] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,230,214,0.3)]"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Agregar Producto</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('ventas')}
                        className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-[#F3F6FC] font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-white/10"
                      >
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Registrar Venta</span>
                      </button>
                    </div>
                  </div>

                  {/* Alertas Preventivas de Caducidad y Mermas (Módulo 5) */}
                  {productosProximosVencer.length > 0 && (
                    <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                            <span>Alerta Preventiva de Caducidad ({productosProximosVencer.length} lote{productosProximosVencer.length > 1 ? 's' : ''})</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200">Próximos 5 a 7 días</span>
                          </h4>
                          <p className="text-xs text-[#8998C2] mt-0.5">
                            {productosProximosVencer.map(p => `${p.nombre} (Vence: ${p.fechaCaducidad})`).join(' • ')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleGenerarPromoWA(productosProximosVencer[0])}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#050B1F] font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generar Promo IA WhatsApp</span>
                      </button>
                    </div>
                  )}

                  {/* Alerta de Reabastecimiento Automático (Módulo 1) */}
                  {productosBajoStock.length > 0 && (
                    <div className="p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#22E6D6]/20 text-[#22E6D6] border border-[#22E6D6]/40 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#22E6D6] flex items-center gap-2">
                            <span>Reabastecimiento Recomendado ({productosBajoStock.length} producto{productosBajoStock.length > 1 ? 's' : ''})</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#22E6D6]/20 text-[#22E6D6]">Stock Mínimo Alcanzado</span>
                          </h4>
                          <p className="text-xs text-[#8998C2] mt-0.5">
                            {productosBajoStock.map(p => `${p.nombre} (Stock: ${p.stock} / Mín: ${p.stockMinimo ?? 5})`).join(' • ')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setModalOrdenCompraOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#22E6D6] hover:bg-cyan-300 text-[#050B1F] font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#22E6D6]/20 shrink-0 cursor-pointer transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Crear Orden Sugerida</span>
                      </button>
                    </div>
                  )}

                  {/* Tarjetas KPI de Estado */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl border border-white/10 bg-[#0A1730]">
                      <span className="text-[11px] font-bold uppercase text-[#8998C2] block">Productos en Catálogo</span>
                      <div className="text-2xl font-black text-[#F3F6FC] mt-1">{productos.length}</div>
                      <span className="text-[10px] text-[#8998C2] mt-1 block">
                        {productosBajoStock.length > 0 ? `${productosBajoStock.length} por agotarse` : 'Existencias saludables'}
                      </span>
                    </div>
                    <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                      <span className="text-[11px] font-bold uppercase text-emerald-400 block">Total de Ventas</span>
                      <div className="text-2xl font-black text-emerald-400 mt-1">${totalIngresos} MXN</div>
                      <span className="text-[10px] text-emerald-400/80 mt-1 block">{ventas.length} transacciones</span>
                    </div>
                    <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                      <span className="text-[11px] font-bold uppercase text-red-400 block">Pérdidas por Merma</span>
                      <div className="text-2xl font-black text-red-400 mt-1">-${totalMermas} MXN</div>
                      <span className="text-[10px] text-red-400/80 mt-1 block">{mermas.length} reportes registrados</span>
                    </div>
                    <div className="p-5 rounded-2xl border border-[#22E6D6]/30 bg-[#22E6D6]/5">
                      <span className="text-[11px] font-bold uppercase text-[#22E6D6] block">Utilidad Neta Real</span>
                      <div className="text-2xl font-black text-[#22E6D6] mt-1">${utilidadNetaReal} MXN</div>
                      <span className="text-[10px] text-[#8998C2] mt-1 block">Gastos fijos: -${totalGastosFijos} MXN</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              MÓDULO B: PRODUCTOS / CATÁLOGO
              ======================================================== */}
          {activeTab === 'productos' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-[#F3F6FC] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#22E6D6]" /> Catálogo de Productos
                  </h3>
                  <p className="text-xs text-[#8998C2] mt-0.5">
                    Registra y administra los artículos y productos de tu negocio directamente.
                  </p>
                </div>
                <button
                  onClick={() => setModalProductoOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,230,214,0.35)] flex items-center gap-2 cursor-pointer hover:shadow-[0_0_30px_rgba(34,230,214,0.55)] transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Agregar Manualmente</span>
                </button>
              </div>

              {/* Artículos en tu Negocio */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-[#F3F6FC]">
                    Artículos en tu Negocio ({productos.length})
                  </h4>
                  {productos.length > 0 && (
                    <button
                      onClick={() => setModalProductoOpen(true)}
                      className="text-xs font-semibold text-[#22E6D6] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Añadir otro producto</span>
                    </button>
                  )}
                </div>

                {productos.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#22E6D6]/10 text-[#22E6D6] border border-[#22E6D6]/30 flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-[#F3F6FC]">
                      Aún no tienes productos registrados
                    </p>
                    <p className="text-xs text-[#8998C2] mt-1 max-w-sm mx-auto">
                      Haz clic en el botón superior "+ Agregar Manualmente" para registrar tu primer producto con su costo, precio y stock.
                    </p>
                    <button
                      onClick={() => setModalProductoOpen(true)}
                      className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-[#22E6D6]/20"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Agregar Manualmente</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productos.map((prod) => (
                      <div key={prod.id} className="p-4 rounded-2xl border border-white/10 bg-[#050B1F] flex flex-col justify-between">
                        <div>
                          <div className="h-32 rounded-xl overflow-hidden relative mb-3 border border-white/10">
                            <Image
                              src={prod.imagen}
                              alt={prod.nombre}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                prod.stock <= (prod.stockMinimo ?? 5)
                                  ? 'bg-red-500/80 text-white border-red-400'
                                  : 'bg-[#0A1730]/90 text-[#22E6D6] border-[#22E6D6]/30'
                              }`}>
                                Stock: {prod.stock} {prod.stock <= (prod.stockMinimo ?? 5) && '(Mín: ' + (prod.stockMinimo ?? 5) + ')'}
                              </span>
                              {prod.fechaCaducidad && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/80 text-black">
                                  Vence: {prod.fechaCaducidad}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-[#8998C2] uppercase font-bold">{prod.categoria}</span>
                          <h5 className="font-bold text-sm text-[#F3F6FC] line-clamp-1">{prod.nombre}</h5>
                          <div className="flex items-center justify-between text-xs mt-2">
                            <span className="text-[#8998C2]">Precio: <strong className="text-[#F3F6FC]">${prod.precio}</strong></span>
                            <span className="text-[#8998C2]">Costo: ${prod.costo}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-semibold">
                              Margen: +${prod.precio - prod.costo} MXN
                            </span>
                            <button
                              onClick={() => saveProductosToStorage(productos.filter((p) => p.id !== prod.id))}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Botón: Generar Promoción IA para WhatsApp (Módulo 6) */}
                          <button
                            type="button"
                            onClick={() => handleGenerarPromoWA(prod)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#22E6D6]/10 to-cyan-500/10 hover:from-[#22E6D6]/20 hover:to-cyan-500/20 border border-[#22E6D6]/30 text-[#22E6D6] text-xs font-bold transition-all cursor-pointer shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generar Promo WhatsApp (IA)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              MÓDULO B2: INVENTARIO (TABLA Y ORDENAMIENTO PERSONALIZABLE)
              ======================================================== */}
          {activeTab === 'inventario' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-[#F3F6FC] flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5 text-[#22E6D6]" /> Control de Inventario
                  </h3>
                  <p className="text-xs text-[#8998C2] mt-0.5">
                    Listado completo con ordenamiento por nombre, precio o existencias.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Botón: Crear Orden de Compra Sugerida (Módulo 1) */}
                  <button
                    type="button"
                    onClick={() => setModalOrdenCompraOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-bold text-xs flex items-center gap-2 shadow-md shadow-[#22E6D6]/20 shrink-0 cursor-pointer hover:opacity-95 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Orden de Compra</span>
                    {productosBajoStock.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono">
                        {productosBajoStock.length}
                      </span>
                    )}
                  </button>

                  {/* Buscador */}
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-4 h-4 text-[#8998C2] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={inventarioSearch}
                      onChange={(e) => setInventarioSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 bg-[#0A1730] text-xs text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>

                  {/* Selector de Orden */}
                  <select
                    value={inventarioOrden}
                    onChange={(e: any) => setInventarioOrden(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-white/10 bg-[#0A1730] text-xs text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  >
                    <option value="az">Orden: A a Z</option>
                    <option value="za">Orden: Z a A</option>
                    <option value="precio-alto">Precio: Mayor a Menor</option>
                    <option value="precio-bajo">Precio: Menor a Mayor</option>
                    <option value="stock">Mayor Existencia</option>
                  </select>
                </div>
              </div>

              {/* Tabla de Inventario */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[#8998C2] border-b border-white/10 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="pb-3">Imagen</th>
                        <th className="pb-3">Producto</th>
                        <th className="pb-3">Categoría</th>
                        <th className="pb-3">Stock Actual</th>
                        <th className="pb-3">Stock Mín.</th>
                        <th className="pb-3">Costo ($ MXN)</th>
                        <th className="pb-3">Precio Venta</th>
                        <th className="pb-3">Valor Bodega</th>
                        <th className="pb-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {inventarioFiltrado.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-[#8998C2]">
                            No hay productos que coincidan con la búsqueda.
                          </td>
                        </tr>
                      ) : (
                        inventarioFiltrado.map((prod) => {
                          const esBajoStock = prod.stock <= (prod.stockMinimo ?? 5);
                          return (
                            <tr key={prod.id} className="hover:bg-white/5">
                              <td className="py-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-white/10">
                                  <Image
                                    src={prod.imagen}
                                    alt={prod.nombre}
                                    fill
                                    unoptimized
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                </div>
                              </td>
                              <td className="py-3">
                                <span className="font-semibold text-[#F3F6FC] block">{prod.nombre}</span>
                                {prod.fechaCaducidad && (
                                  <span className="text-[10px] text-amber-300 font-mono block">
                                    Caduca: {prod.fechaCaducidad}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-[#8998C2]">{prod.categoria}</td>
                              <td className="py-3 font-mono font-bold">
                                <span className={`px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                                  esBajoStock ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                  {esBajoStock && <AlertTriangle className="w-3 h-3 text-red-400" />}
                                  {prod.stock} pzas
                                </span>
                              </td>
                              <td className="py-3 text-[#8998C2] font-mono">{prod.stockMinimo ?? 5} pzas</td>
                              <td className="py-3 text-[#8998C2]">${prod.costo}</td>
                              <td className="py-3 font-bold text-emerald-400">${prod.precio}</td>
                              <td className="py-3 font-mono text-[#F3F6FC]">${prod.stock * prod.precio}</td>
                              <td className="py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleGenerarPromoWA(prod)}
                                    className="text-[#22E6D6] hover:text-cyan-300 p-1.5 rounded-lg hover:bg-white/5"
                                    title="Generar Promoción IA WhatsApp"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => saveProductosToStorage(productos.filter((p) => p.id !== prod.id))}
                                    className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-white/5"
                                    title="Eliminar del inventario"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MÓDULO C: VENTAS OPERATIVAS (DÍA, SEMANA, MES)
              ======================================================== */}
          {activeTab === 'ventas' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-[#F3F6FC] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#22E6D6]" /> Registro de Ventas
                  </h3>
                  <p className="text-xs text-[#8998C2] mt-0.5">Captura ventas diarias, semanales o mensuales.</p>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleAddVenta} className="p-6 rounded-3xl border border-white/10 bg-[#0A1730] space-y-4">
                <h4 className="text-xs font-bold text-[#22E6D6] uppercase tracking-wider">Nueva Entrada de Venta</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-[#8998C2] block mb-1">Producto</label>
                    <select
                      value={nuevaVenta.productoId}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, productoId: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    >
                      <option value="">Selecciona un producto</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} — ${p.precio} MXN (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={nuevaVenta.cantidad}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, cantidad: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Periodo</label>
                    <select
                      value={nuevaVenta.periodo}
                      onChange={(e: any) => setNuevaVenta({ ...nuevaVenta, periodo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    >
                      <option value="dia">Venta del Día</option>
                      <option value="semana">Registro Semanal</option>
                      <option value="mes">Cierre del Mes</option>
                      <option value="ano">Acumulado Anual</option>
                    </select>
                  </div>
                </div>

                {/* Panel Inteligente de Venta Cruzada (Cross-Selling en Caja - Módulo 3) */}
                {productosCrossSelling.length > 0 && (
                  <div className="p-4 rounded-2xl border border-[#22E6D6]/30 bg-[#22E6D6]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#22E6D6]/20 text-[#22E6D6] shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase text-[#22E6D6] tracking-wider block">
                          Sugerencia de Venta Cruzada (Cross-Selling en Caja)
                        </span>
                        <p className="text-xs text-[#8998C2]">
                          Clientes que compran este artículo también suelen adquirir:
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {productosCrossSelling.map((crossProd) => (
                        <button
                          key={crossProd.id}
                          type="button"
                          onClick={() => {
                            setNuevaVenta({ ...nuevaVenta, productoId: crossProd.id });
                            setSaveStatus(`Producto de venta cruzada "${crossProd.nombre}" seleccionado.`);
                            setTimeout(() => setSaveStatus(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#050B1F] hover:border-[#22E6D6] text-xs font-semibold text-[#F3F6FC] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <span>+ {crossProd.nombre}</span>
                          <strong className="text-emerald-400 font-mono">${crossProd.precio}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#22E6D6] text-[#050B1F] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Guardar Venta</span>
                  </button>
                </div>
              </form>

              {/* Listado de Ventas */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730]">
                <h4 className="text-sm font-bold text-[#F3F6FC] mb-4">Historial de Ventas ({ventas.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[#8998C2] border-b border-white/10 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="pb-3">Producto</th>
                        <th className="pb-3">Cantidad</th>
                        <th className="pb-3">Total ($ MXN)</th>
                        <th className="pb-3">Fecha y Hora Exacta</th>
                        <th className="pb-3">Periodo</th>
                        <th className="pb-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ventas.map((v) => (
                        <tr key={v.id} className="hover:bg-white/5">
                          <td className="py-3 font-semibold text-[#F3F6FC]">{v.productoNombre}</td>
                          <td className="py-3 text-[#8998C2]">{v.cantidad} pza(s)</td>
                          <td className="py-3 font-bold text-emerald-400">+ ${v.montoTotal}</td>
                          <td className="py-3 text-[#8998C2] font-mono text-[11px]">{v.fechaHora || v.fecha}</td>
                          <td className="py-3 uppercase font-mono text-[10px] text-[#22E6D6]">{v.periodo}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => saveVentasToStorage(ventas.filter((item) => item.id !== v.id))}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MÓDULO C2: MERMAS Y PÉRDIDAS (DÍA, MES, AÑO)
              ======================================================== */}
          {activeTab === 'mermas' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-[#F3F6FC] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" /> Registro de Mermas y Pérdidas
                  </h3>
                  <p className="text-xs text-[#8998C2] mt-0.5">
                    Desglose por producto dañado o caducado en el día, mes o año.
                  </p>
                </div>
              </div>

              {/* Formulario de Merma */}
              <form onSubmit={handleAddMerma} className="p-6 rounded-3xl border border-red-500/20 bg-red-500/5 space-y-4">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Reportar Mercancía Afectada</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Producto</label>
                    <select
                      value={nuevaMerma.productoId}
                      onChange={(e) => setNuevaMerma({ ...nuevaMerma, productoId: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-red-400 focus:outline-none"
                    >
                      <option value="">Selecciona producto</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} (Costo: ${p.costo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Cantidad Dañada/Caducada</label>
                    <input
                      type="number"
                      min="1"
                      value={nuevaMerma.cantidad}
                      onChange={(e) => setNuevaMerma({ ...nuevaMerma, cantidad: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-red-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Motivo</label>
                    <select
                      value={nuevaMerma.motivo}
                      onChange={(e) => setNuevaMerma({ ...nuevaMerma, motivo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-red-400 focus:outline-none"
                    >
                      <option value="Caducidad o fecha vencida">Caducidad o fecha vencida</option>
                      <option value="Producto dañado en traslado/empaque">Producto dañado en traslado/empaque</option>
                      <option value="Defecto de fábrica">Defecto de fábrica</option>
                      <option value="Merma por clima o humedad">Merma por clima o humedad</option>
                      <option value="Diferencia de inventario">Diferencia de inventario</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Periodo</label>
                    <select
                      value={nuevaMerma.periodo}
                      onChange={(e: any) => setNuevaMerma({ ...nuevaMerma, periodo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-red-400 focus:outline-none"
                    >
                      <option value="dia">Pérdida del Día</option>
                      <option value="mes">Pérdida del Mes</option>
                      <option value="ano">Pérdida del Año</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Registrar Merma</span>
                  </button>
                </div>
              </form>

              {/* Listado de Mermas */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730]">
                <h4 className="text-sm font-bold text-[#F3F6FC] mb-4">Historial de Mermas ({mermas.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[#8998C2] border-b border-white/10 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="pb-3">Producto</th>
                        <th className="pb-3">Cantidad</th>
                        <th className="pb-3">Pérdida ($ MXN)</th>
                        <th className="pb-3">Motivo</th>
                        <th className="pb-3">Fecha y Hora Exacta</th>
                        <th className="pb-3">Periodo</th>
                        <th className="pb-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {mermas.map((m) => (
                        <tr key={m.id} className="hover:bg-white/5">
                          <td className="py-3 font-semibold text-[#F3F6FC]">{m.productoNombre}</td>
                          <td className="py-3 text-[#8998C2]">{m.cantidad} pza(s)</td>
                          <td className="py-3 font-bold text-red-400">- ${m.costoDevaluacion}</td>
                          <td className="py-3 text-[#8998C2]">{m.motivo}</td>
                          <td className="py-3 text-[#8998C2] font-mono text-[11px]">{m.fechaHora || m.fecha}</td>
                          <td className="py-3 uppercase font-mono text-[10px] text-red-300">{m.periodo}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => saveMermasToStorage(mermas.filter((item) => item.id !== m.id))}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MÓDULO D: MÉTRICAS Y ANALÍTICA PREDICTIVA CON IA
              ======================================================== */}
          {activeTab === 'metricas' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-[#F3F6FC] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#22E6D6]" /> Métricas de Negocio & Analítica Predictiva
                  </h3>
                  <p className="text-xs text-[#8998C2] mt-0.5">
                    Filtra por producto, evalúa el comportamiento macro y visualiza proyecciones con IA.
                  </p>
                </div>

                {/* Filtro por Producto y Periodo */}
                <div className="flex items-center gap-3">
                  <select
                    value={filtroMetricaProducto}
                    onChange={(e) => setFiltroMetricaProducto(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-white/10 bg-[#0A1730] text-xs text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  >
                    <option value="todos">Todos los Productos</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filtroMetricaPeriodo}
                    onChange={(e: any) => setFiltroMetricaPeriodo(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-white/10 bg-[#0A1730] text-xs text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  >
                    <option value="dia">Día</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mes</option>
                    <option value="ano">Año</option>
                  </select>
                </div>
              </div>

              {/* Vista Macro: Ingresos, Mermas, Gastos Fijos y Utilidad Neta Real */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-white/10 bg-[#0A1730]">
                  <span className="text-[11px] font-bold text-[#8998C2] uppercase">Ingresos por Ventas</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">${totalIngresos} MXN</div>
                  <span className="text-[10px] text-emerald-400/80 mt-1 block">Ventas de hoy: ${ventasHoy} MXN</span>
                </div>

                <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                  <span className="text-[11px] font-bold text-red-400 uppercase">Pérdidas por Mermas</span>
                  <div className="text-2xl font-black text-red-400 mt-1">-${totalMermas} MXN</div>
                  <span className="text-[10px] text-red-300 mt-1 block">{mermas.length} registros de devaluación</span>
                </div>

                <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">Gastos Operativos Fijos</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">-${totalGastosFijos} MXN</div>
                  <span className="text-[10px] text-amber-300 mt-1 block">{gastosFijos.length} conceptos registrados</span>
                </div>

                <div className="p-5 rounded-2xl border border-[#22E6D6]/40 bg-[#22E6D6]/10 shadow-[0_0_20px_rgba(34,230,214,0.15)]">
                  <span className="text-[11px] font-bold text-[#22E6D6] uppercase">Utilidad Neta Real</span>
                  <div className="text-2xl font-black text-[#22E6D6] mt-1">${utilidadNetaReal} MXN</div>
                  <span className="text-[10px] text-cyan-300 font-mono mt-1 block">
                    (Ventas - Mermas - Gastos)
                  </span>
                </div>
              </div>

              {/* ========================================================
                  MÓDULO 2: CALCULADORA DE GASTOS FIJOS Y OPERATIVOS
                  ======================================================== */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <h4 className="text-base font-black text-[#F3F6FC] flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-amber-400" /> Calculadora de Gastos Operativos Fijos
                    </h4>
                    <p className="text-xs text-[#8998C2] mt-0.5">
                      Registra los costos esenciales de tu PyME (renta de local, luz, nómina, internet) para calcular la utilidad neta real.
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                    Total Gastos: ${totalGastosFijos} MXN
                  </div>
                </div>

                {/* Formulario de Gasto Fijo */}
                <form onSubmit={handleAddGastoFijo} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-white/10 bg-[#050B1F]">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-[#8998C2] block mb-1">Concepto del Gasto</label>
                    <input
                      type="text"
                      placeholder="Ej. Renta de local comercial / Pago nómina"
                      value={nuevoGasto.nombre}
                      onChange={(e) => setNuevoGasto({ ...nuevoGasto, nombre: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0A1730] text-xs sm:text-sm text-[#F3F6FC] focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Categoría</label>
                    <select
                      value={nuevoGasto.categoria}
                      onChange={(e: any) => setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0A1730] text-xs sm:text-sm text-[#F3F6FC] focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Renta">Renta</option>
                      <option value="Luz / Electricidad">Luz / Electricidad</option>
                      <option value="Nómina">Nómina</option>
                      <option value="Internet / Teléfono">Internet / Teléfono</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Monto ($ MXN)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="2500.00"
                        value={nuevoGasto.monto}
                        onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0A1730] text-xs sm:text-sm text-[#F3F6FC] focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#050B1F] font-bold text-xs shrink-0 cursor-pointer shadow-md shadow-amber-400/20 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Listado de Gastos Fijos */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[#8998C2] border-b border-white/10 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="pb-2.5">Concepto</th>
                        <th className="pb-2.5">Categoría</th>
                        <th className="pb-2.5">Monto ($ MXN)</th>
                        <th className="pb-2.5">Fecha de Registro</th>
                        <th className="pb-2.5 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {gastosFijos.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-[#8998C2]">
                            No hay gastos operativos fijos registrados aún. Usa el formulario superior.
                          </td>
                        </tr>
                      ) : (
                        gastosFijos.map((g) => (
                          <tr key={g.id} className="hover:bg-white/5">
                            <td className="py-2.5 font-semibold text-[#F3F6FC]">{g.nombre}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 border border-white/10 text-amber-300">
                                {g.categoria}
                              </span>
                            </td>
                            <td className="py-2.5 font-bold text-amber-400">-${g.monto}</td>
                            <td className="py-2.5 text-[#8998C2] font-mono text-[11px]">{g.fecha}</td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => saveGastosFijosToStorage(gastosFijos.filter((item) => item.id !== g.id))}
                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-white/5"
                                title="Eliminar gasto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gráfica Comparativa de Utilidad Neta Real */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730]">
                <h4 className="text-sm font-bold text-[#F3F6FC] mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#22E6D6]" />
                  <span>Desglose de Rentabilidad: Ingresos vs Mermas vs Gastos vs Utilidad Neta Real</span>
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { concepto: 'Ventas Totales', monto: totalIngresos, fill: '#10B981' },
                        { concepto: 'Mermas/Pérdidas', monto: totalMermas, fill: '#EF4444' },
                        { concepto: 'Gastos Fijos', monto: totalGastosFijos, fill: '#F59E0B' },
                        { concepto: 'Utilidad Neta Real', monto: Math.max(0, utilidadNetaReal), fill: '#22E6D6' },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="concepto" stroke="#8998C2" fontSize={11} />
                      <YAxis stroke="#8998C2" fontSize={11} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#050B1F', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => [`$${val} MXN`, 'Total']}
                      />
                      <Bar dataKey="monto" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico Predictivo con IA: Ganancias Estimadas para Próximos Meses */}
              <div className="p-6 rounded-3xl border border-[#22E6D6]/30 bg-[#0A1730] relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22E6D6]/10 border border-[#22E6D6]/30 text-[#22E6D6] text-xs font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Algoritmo Predictivo NEXO Brain
                    </div>
                    <h4 className="text-lg font-black text-[#F3F6FC]">
                      Estimaciones y Predicciones de IA para los Próximos Meses
                    </h4>
                    <p className="text-xs text-[#8998C2]">
                      Calculado con el ritmo de carga de productos ({productos.length}), tasa de ventas y amortización de mermas.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#22E6D6] bg-[#050B1F] px-3 py-1.5 rounded-xl border border-white/10">
                    Confianza del Modelo: 96.8%
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={datosPrediccionIA}>
                      <defs>
                        <linearGradient id="colorEstimado" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22E6D6" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#22E6D6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="mes" stroke="#8998C2" fontSize={12} />
                      <YAxis stroke="#8998C2" fontSize={12} tickFormatter={(val) => `$${val}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#050B1F', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(value: any) => [`$${value} MXN`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="estimado" name="Ganancia Estimada por IA ($ MXN)" stroke="#22E6D6" strokeWidth={3} fill="url(#colorEstimado)" />
                      <Line type="monotone" dataKey="mermas" name="Mermas Controladas ($ MXN)" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MÓDULO E: PROVEEDORES CLAVE
              ======================================================== */}
          {activeTab === 'proveedores' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-[#F3F6FC] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#22E6D6]" /> Directorio de Proveedores
                  </h3>
                  <p className="text-xs text-[#8998C2] mt-0.5">
                    Registra y da seguimiento a pedidos de insumos y fechas de entrega.
                  </p>
                </div>
              </div>

              {/* Formulario de Proveedor */}
              <form onSubmit={handleAddProveedor} className="p-6 rounded-3xl border border-white/10 bg-[#0A1730] space-y-4">
                <h4 className="text-xs font-bold text-[#22E6D6] uppercase tracking-wider">Nuevo Proveedor</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Nombre del Proveedor</label>
                    <input
                      type="text"
                      placeholder="Ej. Distribuidora Maya / Textiles Sisal"
                      value={nuevoProveedor.nombre}
                      onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="Ej. +52 985 999 1234"
                      value={nuevoProveedor.telefono}
                      onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, telefono: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Categoría / Paquete que Surte</label>
                    <input
                      type="text"
                      placeholder="Ej. Paquete de gorras / Granos de café"
                      value={nuevoProveedor.categoriaPaquete}
                      onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, categoriaPaquete: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#8998C2] block mb-1">Fecha Estimada de Entrega</label>
                    <input
                      type="date"
                      value={nuevoProveedor.fechaEntrega}
                      onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, fechaEntrega: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22E6D6] text-[#050B1F] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(34,230,214,0.3)] hover:bg-cyan-300 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Guardar Proveedor</span>
                  </button>
                </div>
              </form>

              {/* Directorio de Proveedores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proveedores.length === 0 ? (
                  <div className="col-span-full p-8 rounded-3xl border border-white/10 bg-[#0A1730] text-center text-[#8998C2] text-xs">
                    No has registrado proveedores aún. Utiliza el formulario superior.
                  </div>
                ) : (
                  proveedores.map((prov) => (
                    <div key={prov.id} className="p-5 rounded-2xl border border-white/10 bg-[#0A1730] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono font-bold text-[#22E6D6] uppercase px-2 py-0.5 rounded bg-[#22E6D6]/10 border border-[#22E6D6]/20">
                            {prov.categoriaPaquete}
                          </span>
                          <button
                            onClick={() => saveProveedoresToStorage(proveedores.filter((p) => p.id !== prov.id))}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-base text-[#F3F6FC]">{prov.nombre}</h4>
                        <div className="mt-3 space-y-1 text-xs text-[#8998C2]">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-[#22E6D6]" />
                            <a href={`tel:${prov.telefono}`} className="hover:text-[#F3F6FC]">{prov.telefono}</a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Entrega: {prov.fechaEntrega}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <a
                          href={`https://wa.me/${prov.telefono.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-white/10 hover:border-emerald-500/30 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Proveedor</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              MÓDULO F: AJUSTES DE USUARIO
              ======================================================== */}
          {activeTab === 'ajustes' && (
            <div className="max-w-4xl space-y-8">
              {/* ---- Encabezado ---- */}
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-[#F3F6FC] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#22E6D6]" /> Ajustes de Usuario & Pyme
                </h3>
                <p className="text-xs text-[#8998C2] mt-0.5">Modifica el nombre de tu empresa, correo, contraseña y gestiona tu suscripción.</p>
              </div>

              {/* ---- Formulario de Perfil ---- */}
              <form onSubmit={handleSaveAjustes} className="p-6 rounded-3xl border border-white/10 bg-[#0A1730] space-y-5">
                <h4 className="text-sm font-bold text-[#F3F6FC] flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#22E6D6]" /> Datos del Titular
                </h4>

                {/* ---- Avatar Upload ---- */}
                <div className="flex items-center gap-5 pb-3 border-b border-white/10">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#22E6D6]/15 border-2 border-[#22E6D6]/40 flex items-center justify-center font-black text-2xl text-[#22E6D6] shrink-0 shadow-[0_0_20px_rgba(34,230,214,0.2)]">
                    {profile.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile.nombre?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-[#F3F6FC]">{profile.nombre}</p>
                    <p className="text-xs text-[#8998C2]">{profile.empresa}</p>
                    {/* Input de archivo oculto */}
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                      id="avatar-upload-input"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#22E6D6]/40 bg-[#22E6D6]/10 text-[#22E6D6] text-xs font-bold hover:bg-[#22E6D6]/20 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Cambiar foto de perfil
                    </button>
                    <p className="text-[10px] text-[#8998C2]">PNG, JPG o WEBP · Máx. 3 MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#8998C2] block mb-1">Nombre del Titular</label>
                    <input
                      type="text"
                      value={profile.nombre}
                      onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#8998C2] block mb-1">Nombre de la Pyme / Empresa</label>
                    <input
                      type="text"
                      value={profile.empresa}
                      onChange={(e) => setProfile({ ...profile, empresa: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#8998C2] block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#8998C2] block mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={profile.password}
                      onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,230,214,0.35)] cursor-pointer hover:shadow-[0_0_30px_rgba(34,230,214,0.55)] transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>

              {/* ---- Control de Seguridad: PIN de Administrador (Módulo 4) ---- */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="text-sm font-bold text-[#F3F6FC] flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#22E6D6]" /> Seguridad y Clave de Administrador
                    </h4>
                    <p className="text-xs text-[#8998C2] mt-0.5">
                      Protege tus métricas financieras, utilidades netas, directorio de proveedores y ajustes para el personal en Modo Cajero.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#22E6D6]/10 text-[#22E6D6] font-mono text-xs font-bold border border-[#22E6D6]/30">
                    PIN Activo: ••••
                  </span>
                </div>

                <form onSubmit={handleCambiarPin} className="flex flex-col sm:flex-row items-start sm:items-end gap-3 max-w-lg">
                  <div className="flex-1 w-full">
                    <label className="text-xs text-[#8998C2] block mb-1">Nuevo PIN de Seguridad (4 dígitos)</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Ej. 5821"
                      value={nuevoPin}
                      onChange={(e) => setNuevoPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] tracking-widest font-mono focus:border-[#22E6D6] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={nuevoPin.length < 4}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#22E6D6] hover:bg-cyan-300 disabled:opacity-50 text-[#050B1F] font-bold text-xs cursor-pointer shadow-md shadow-[#22E6D6]/20 transition-all shrink-0"
                  >
                    Actualizar PIN
                  </button>
                </form>
                <p className="text-[10px] text-[#8998C2]">
                  * El PIN por defecto es <strong>1234</strong>. Cámbialo para restringir el acceso a métricas de utilidades y finanzas.
                </p>
              </div>

              {/* ===================================================
                  PANEL DE SUSCRIPCIÓN & FACTURACIÓN (MERCADO PAGO)
                  =================================================== */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-[#F3F6FC] flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#22E6D6]" /> Suscripción & Facturación
                    </h4>
                    <p className="text-xs text-[#8998C2] mt-0.5">Administra tu plan activo y realiza pagos seguros a través de Mercado Pago.</p>
                  </div>
                  {/* Indicador de plan actual */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#22E6D6]/40 bg-[#22E6D6]/10 text-xs font-bold text-[#22E6D6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22E6D6] animate-pulse" />
                    Plan activo: {planActivo === 'basico' ? 'Básico' : planActivo === 'pro' ? 'Pro' : 'Enterprise'}
                  </span>
                </div>

                {/* Tarjetas de Planes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  {/* Plan Básico */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative p-6 rounded-3xl border flex flex-col justify-between ${
                      planActivo === 'basico'
                        ? 'border-[#22E6D6]/60 bg-[#22E6D6]/5 shadow-[0_0_30px_rgba(34,230,214,0.18)]'
                        : 'border-white/10 bg-[#0A1730] hover:border-white/25'
                    }`}
                  >
                    {planActivo === 'basico' && (
                      <span className="absolute -top-3 left-5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#22E6D6] text-[#050B1F]">Activo</span>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <ShieldCheck className="w-5 h-5 text-[#8998C2]" />
                        </div>
                        <span className="text-sm font-bold text-[#F3F6FC]">Plan Básico</span>
                      </div>
                      <div className="mb-1">
                        <span className="text-3xl font-black text-[#F3F6FC]">$0</span>
                        <span className="text-xs text-[#8998C2] ml-1">/ mes</span>
                      </div>
                      <p className="text-xs text-[#8998C2] mb-5">Ideal para emprendedores iniciando su digitalización.</p>
                      <ul className="space-y-2 text-xs text-[#8998C2]">
                        {['Catálogo hasta 20 productos', 'Registro de ventas y mermas', 'Chatbot Gemini (20 consultas/mes)', 'Soporte por WhatsApp'].map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      disabled
                      className="mt-6 w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-[#8998C2] cursor-not-allowed opacity-60"
                    >
                      {planActivo === 'basico' ? 'Plan Actual' : 'Gratuito'}
                    </button>
                  </motion.div>

                  {/* Plan Pro ⭐ */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative p-6 rounded-3xl border flex flex-col justify-between ${
                      planActivo === 'pro'
                        ? 'border-[#22E6D6] bg-gradient-to-b from-[#22E6D6]/10 to-[#0A1730] shadow-[0_0_50px_rgba(34,230,214,0.3)]'
                        : 'border-[#22E6D6]/40 bg-gradient-to-b from-[#22E6D6]/5 to-[#0A1730] shadow-[0_0_25px_rgba(34,230,214,0.12)]'
                    }`}
                  >
                    <span className="absolute -top-3 left-5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F]">
                      {planActivo === 'pro' ? '⭐ Activo' : '⭐ Más popular'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-xl bg-[#22E6D6]/15 border border-[#22E6D6]/40">
                          <Sparkles className="w-5 h-5 text-[#22E6D6]" />
                        </div>
                        <span className="text-sm font-bold text-[#F3F6FC]">Plan Pyme Pro</span>
                      </div>
                      <div className="mb-1">
                        <span className="text-3xl font-black text-[#22E6D6]">$2,500</span>
                        <span className="text-xs text-[#8998C2] ml-1">MXN / mes</span>
                      </div>
                      <p className="text-xs text-[#8998C2] mb-5">Automatización completa para Pymes en crecimiento.</p>
                      <ul className="space-y-2 text-xs text-[#8998C2]">
                        {[
                          'Catálogo ilimitado de productos',
                          'Chatbot IA sin límite de consultas',
                          'Predicciones y analítica avanzada',
                          'Integración con Mercado Pago',
                          'Soporte prioritario 24/7',
                          'Panel multi-usuario (3 colaboradores)',
                        ].map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#22E6D6] shrink-0" />
                            <span className="text-[#F3F6FC]">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleCheckoutMP('pro', 'Plan Pyme Pro NEXO.IA', 2500)}
                      disabled={!!suscripcionLoading || planActivo === 'pro'}
                      className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(34,230,214,0.35)] hover:shadow-[0_0_35px_rgba(34,230,214,0.55)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {suscripcionLoading === 'pro' ? (
                        <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Redirigiendo...</>
                      ) : planActivo === 'pro' ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Plan Activo</>
                      ) : (
                        <><DollarSign className="w-3.5 h-3.5" /> Suscribirme — Mercado Pago</>
                      )}
                    </button>
                  </motion.div>

                  {/* Plan Enterprise */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative p-6 rounded-3xl border flex flex-col justify-between ${
                      planActivo === 'enterprise'
                        ? 'border-purple-400/60 bg-purple-500/5 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                        : 'border-purple-500/30 bg-[#0A1730] hover:border-purple-400/50'
                    }`}
                  >
                    {planActivo === 'enterprise' && (
                      <span className="absolute -top-3 left-5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white">Activo</span>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30">
                          <Building2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-sm font-bold text-[#F3F6FC]">Enterprise</span>
                      </div>
                      <div className="mb-1">
                        <span className="text-3xl font-black text-purple-300">$8,500</span>
                        <span className="text-xs text-[#8998C2] ml-1">MXN / mes</span>
                      </div>
                      <p className="text-xs text-[#8998C2] mb-5">Solución corporativa para empresas de alto volumen.</p>
                      <ul className="space-y-2 text-xs text-[#8998C2]">
                        {[
                          'Todo lo de Plan Pro incluido',
                          'Agentes autónomos personalizados',
                          'Usuarios ilimitados',
                          'API de integración empresarial',
                          'Onboarding presencial en Valladolid',
                          'SLA garantizado 99.98% uptime',
                        ].map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span className="text-[#F3F6FC]">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleCheckoutMP('enterprise', 'Plan Enterprise NEXO.IA', 8500)}
                      disabled={!!suscripcionLoading || planActivo === 'enterprise'}
                      className="mt-6 w-full py-3 rounded-xl border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-black text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {suscripcionLoading === 'enterprise' ? (
                        <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Redirigiendo...</>
                      ) : planActivo === 'enterprise' ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Plan Activo</>
                      ) : (
                        <><DollarSign className="w-3.5 h-3.5" /> Contratar — Mercado Pago</>
                      )}
                    </button>
                  </motion.div>

                </div>

                {/* Bloque de Seguridad de Pago */}
                <div className="p-4 rounded-2xl border border-white/10 bg-[#0A1730]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F3F6FC]">Pagos seguros con Mercado Pago</p>
                      <p className="text-[11px] text-[#8998C2]">Encriptación SSL 256-bit • Sin guardar datos de tarjeta • Cancelable cuando quieras</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Logos simulados de métodos de pago */}
                    {['VISA', 'MC', 'AMEX', 'OXXO'].map((m) => (
                      <span key={m} className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-[#8998C2]">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Historial de Facturación */}
                <div className="p-6 rounded-3xl border border-white/10 bg-[#0A1730] space-y-4">
                  <h5 className="text-sm font-bold text-[#F3F6FC] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#22E6D6]" /> Historial de Facturación
                  </h5>
                  {planActivo !== 'basico' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-[#8998C2] border-b border-white/10">
                            <th className="text-left py-2 font-semibold">Fecha</th>
                            <th className="text-left py-2 font-semibold">Concepto</th>
                            <th className="text-left py-2 font-semibold">Monto</th>
                            <th className="text-left py-2 font-semibold">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 text-[#8998C2]">Oct 2026</td>
                            <td className="py-3 text-[#F3F6FC] font-medium">
                              Plan {planActivo === 'pro' ? 'Pyme Pro' : 'Enterprise'} NEXO.IA
                            </td>
                            <td className="py-3 font-bold text-[#22E6D6]">
                              ${planActivo === 'pro' ? '2,500' : '8,500'} MXN
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">Pagado</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-[#8998C2]">
                      <DollarSign className="w-8 h-8 text-white/10 mx-auto mb-2" />
                      No hay facturas aún — estás en el plan gratuito.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          MODAL: AGREGAR PRODUCTO MANUALMENTE (SUBIDA NATIVA DE IMAGEN + STOCK MÍNIMO + CADUCIDAD)
          ======================================================== */}
      {modalProductoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B1F]/80 backdrop-blur-xl">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A1730] p-6 sm:p-8 text-[#F3F6FC] shadow-[0_20px_60px_rgba(5,11,31,0.95)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalProductoOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl border border-white/10 bg-white/5 text-[#8998C2] hover:text-[#F3F6FC]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-[#F3F6FC] mb-4">Agregar Producto al Catálogo</h3>

            <form onSubmit={handleAddProductoManual} className="space-y-4">
              <div>
                <label className="text-xs text-[#8998C2] block mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Artesanía Textil Bordada"
                  value={productoManual.nombre}
                  onChange={(e) => setProductoManual({ ...productoManual, nombre: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                />
              </div>

              {/* Subida Nativa de Imagen (Requisito A) */}
              <div>
                <label className="text-xs text-[#8998C2] block mb-1">Fotografía del Producto (Nativa / Cámara)</label>
                <input
                  ref={productoImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProductoImageChange}
                  id="producto-image-native-input"
                />
                <div className="flex items-center gap-4 p-3 rounded-2xl border border-white/10 bg-[#050B1F]">
                  <div className="w-16 h-16 rounded-xl border border-white/15 overflow-hidden relative bg-[#0A1730] shrink-0">
                    {productoManual.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={productoManual.imagen} alt="Vista previa" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8998C2]">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => productoImageRef.current?.click()}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#22E6D6]/40 bg-[#22E6D6]/10 text-[#22E6D6] text-xs font-bold hover:bg-[#22E6D6]/20 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Cargar Archivo / Cámara</span>
                    </button>
                    <p className="text-[10px] text-[#8998C2]">
                      Explorador de archivos en PC/Laptop o cámara/galería en móvil · Vista previa instantánea
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8998C2] block mb-1">Categoría</label>
                  <input
                    type="text"
                    placeholder="Ej. Bebidas / Textil / Comida"
                    value={productoManual.categoria}
                    onChange={(e) => setProductoManual({ ...productoManual, categoria: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8998C2] block mb-1">Fecha de Caducidad (Opcional - Módulo 5)</label>
                  <input
                    type="date"
                    value={productoManual.fechaCaducidad}
                    onChange={(e) => setProductoManual({ ...productoManual, fechaCaducidad: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-[#8998C2] block mb-1">Costo Adq. ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="90.00"
                    value={productoManual.costo}
                    onChange={(e) => setProductoManual({ ...productoManual, costo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8998C2] block mb-1">Precio Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="180.00"
                    required
                    value={productoManual.precio}
                    onChange={(e) => setProductoManual({ ...productoManual, precio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8998C2] block mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    placeholder="30"
                    value={productoManual.stock}
                    onChange={(e) => setProductoManual({ ...productoManual, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8998C2] block mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    placeholder="5"
                    value={productoManual.stockMinimo}
                    onChange={(e) => setProductoManual({ ...productoManual, stockMinimo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#050B1F] text-xs sm:text-sm text-[#F3F6FC] focus:border-[#22E6D6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalProductoOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-[#8998C2] hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#22E6D6] to-cyan-400 text-[#050B1F] font-bold text-xs shadow-lg shadow-[#22E6D6]/30 cursor-pointer hover:opacity-95 transition-all"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ORDEN DE COMPRA SUGERIDA (MÓDULO 1)
          ======================================================== */}
      {modalOrdenCompraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B1F]/80 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0A1730] p-6 sm:p-8 text-[#F3F6FC] shadow-[0_20px_60px_rgba(5,11,31,0.95)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOrdenCompraOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl border border-white/10 bg-white/5 text-[#8998C2] hover:text-[#F3F6FC]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#22E6D6]/15 border border-[#22E6D6]/30 text-[#22E6D6] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#F3F6FC]">Orden de Compra Sugerida</h3>
                <p className="text-xs text-[#8998C2]">Generada automáticamente según niveles de stock mínimo.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050B1F] border border-white/10 font-mono text-xs text-[#8998C2] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {generarTextoOrdenCompra()}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generarTextoOrdenCompra());
                  setOrdenCopiada(true);
                  setTimeout(() => setOrdenCopiada(false), 2500);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-[#F3F6FC] transition-all cursor-pointer"
              >
                {ordenCopiada ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{ordenCopiada ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-[#F3F6FC] transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(generarTextoOrdenCompra())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-[#050B1F] font-bold text-xs shadow-lg shadow-[#25D366]/30 hover:opacity-90 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: GENERADOR DE PROMOCIÓN WHATSAPP CON IA (MÓDULO 6)
          ======================================================== */}
      {promoModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B1F]/80 backdrop-blur-xl">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0A1730] p-6 sm:p-8 text-[#F3F6FC] shadow-[0_20px_60px_rgba(5,11,31,0.95)]">
            <button
              onClick={() => setPromoModal({ ...promoModal, open: false })}
              className="absolute top-5 right-5 p-2 rounded-xl border border-white/10 bg-white/5 text-[#8998C2] hover:text-[#F3F6FC]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22E6D6] to-cyan-400 text-[#050B1F] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#F3F6FC]">Promoción WhatsApp con IA</h3>
                <p className="text-xs text-[#8998C2]">
                  {promoModal.producto?.nombre} · {promoModal.descuento} OFF
                </p>
              </div>
            </div>

            {promoModal.loading ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#22E6D6] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#8998C2] font-mono">Gemini redactando copy persuasivo para WhatsApp...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#050B1F] border border-white/10 font-mono text-xs text-[#F3F6FC] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {promoModal.texto}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(promoModal.texto);
                      setPromoCopiada(true);
                      setTimeout(() => setPromoCopiada(false), 2500);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-[#F3F6FC] transition-all cursor-pointer"
                  >
                    {promoCopiada ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{promoCopiada ? '¡Copiado!' : 'Copiar Mensaje'}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(promoModal.texto)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-[#050B1F] font-bold text-xs shadow-lg shadow-[#25D366]/30 hover:opacity-90 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Abrir en WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PIN DE ACCESO ADMINISTRADOR (MÓDULO 4)
          ======================================================== */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B1F]/85 backdrop-blur-xl">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0A1730] p-6 text-center text-[#F3F6FC] shadow-[0_20px_60px_rgba(5,11,31,0.95)]">
            <button
              onClick={() => { setShowPinModal(false); setPendingTab(null); }}
              className="absolute top-4 right-4 p-2 rounded-xl border border-white/10 bg-white/5 text-[#8998C2] hover:text-[#F3F6FC]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#22E6D6]/10 text-[#22E6D6] border border-[#22E6D6]/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-[#F3F6FC]">Acceso Administrador</h3>
            <p className="text-xs text-[#8998C2] mt-1 mb-4">
              Ingresa el PIN de 4 dígitos para acceder a métricas, proveedores y ajustes.
            </p>

            <form onSubmit={handleVerificarPin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                  setPinError(false);
                }}
                className={`w-full text-center text-2xl font-mono tracking-widest px-4 py-3 rounded-xl border bg-[#050B1F] text-[#22E6D6] focus:outline-none ${
                  pinError ? 'border-red-500' : 'border-white/10 focus:border-[#22E6D6]'
                }`}
              />

              {pinError && (
                <p className="text-xs text-red-400 font-semibold">
                  PIN incorrecto. (PIN por defecto: 1234)
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowPinModal(false); setPendingTab(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs text-[#8998C2] hover:bg-white/5 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#22E6D6] hover:bg-cyan-300 text-[#050B1F] font-bold text-xs shadow-md shadow-[#22E6D6]/20 cursor-pointer transition-all"
                >
                  Desbloquear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MÓDULO 6.A: PANEL LATERAL DERECHO FLOTANTE (CHATBOT GEMINI API)
          ======================================================== */}
      <AnimatePresence>
        {chatbotOpen && (
          <>
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatbotOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel lateral derecho */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#0A1730] border-l border-white/10 z-50 flex flex-col justify-between shadow-[0_0_50px_rgba(5,11,31,0.9)]"
            >
              {/* Header del Chatbot */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#050B1F]/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22E6D6] to-cyan-400 flex items-center justify-center text-[#050B1F] shadow-[0_0_20px_rgba(34,230,214,0.4)]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#F3F6FC] flex items-center gap-1.5">
                      <span>Asistente Táctico Pyme</span>
                      <span className="text-[10px] font-mono text-[#22E6D6] px-1.5 py-0.5 rounded bg-[#22E6D6]/10">GEMINI</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Contexto de tu empresa cargado
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setChatbotOpen(false)}
                  className="p-2 rounded-xl border border-white/10 text-[#8998C2] hover:text-[#F3F6FC] hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mensajes del Chat */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#22E6D6] text-[#050B1F] font-semibold rounded-tr-sm shadow-md'
                          : 'bg-[#050B1F] text-[#F3F6FC] border border-white/10 rounded-tl-sm shadow-inner'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#8998C2]">
                    <div className="w-2 h-2 rounded-full bg-[#22E6D6] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#22E6D6] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-[#22E6D6] animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 font-mono">Gemini analizando datos...</span>
                  </div>
                )}
              </div>

              {/* Formulario de Entrada */}
              <div className="p-4 border-t border-white/10 bg-[#050B1F]/60">
                <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Escribe tu consulta de negocio..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#0A1730] text-xs text-[#F3F6FC] placeholder-[#8998C2]/40 focus:border-[#22E6D6] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2.5 rounded-xl bg-[#22E6D6] text-[#050B1F] hover:bg-cyan-300 transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(34,230,214,0.3)]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================
          MÓDULO 6.B: BOTÓN FLOTANTE DE WHATSAPP 24/7 (ESQUINA INFERIOR DERECHA)
          Icono de auriculares/micrófono, tooltip "Servicio de ayuda 24/7", link https://wa.me/529831862234
          ======================================================== */}
      <div className="fixed bottom-6 right-6 z-40 group">
        {/* Tooltip al pasar cursor */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A1730] border border-white/15 text-xs text-[#F3F6FC] whitespace-nowrap shadow-xl shadow-black/60 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Servicio de ayuda 24/7</span>
        </div>

        <motion.a
          href="https://wa.me/529831862234"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-[#050B1F] shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:shadow-[0_0_45px_rgba(37,211,102,0.9)] border-2 border-white/20 transition-all cursor-pointer"
          aria-label="Servicio de ayuda 24/7 WhatsApp"
        >
          <Headphones className="w-6 h-6 stroke-[2.4]" />
        </motion.a>
      </div>
    </div>
  );
}

export default function DashboardClientPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050B1F] flex items-center justify-center text-[#22E6D6]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#22E6D6] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-[#8998C2]">Iniciando Plataforma NEXO.IA...</span>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
