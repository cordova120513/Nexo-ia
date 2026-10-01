-- ==============================================================================
-- NEXO.IA: POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS) Y MULTI-TENANCY
-- ==============================================================================

-- 1. TABLA EMPRESAS
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(120) NOT NULL,
    giro VARCHAR(80),
    pin_admin VARCHAR(4) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresas: Acceso exclusivo por usuario propietario"
    ON public.empresas
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. TABLA PRODUCTOS
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(120) NOT NULL,
    precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    costo NUMERIC(12, 2) NOT NULL CHECK (costo >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_minimo INTEGER DEFAULT 5 CHECK (stock_minimo >= 0),
    categoria VARCHAR(60),
    proveedor VARCHAR(80),
    fecha_caducidad DATE,
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Productos: Aislamiento por usuario y empresa"
    ON public.productos
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. TABLA VENTAS
CREATE TABLE IF NOT EXISTS public.ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES public.productos(id) ON DELETE SET NULL,
    producto_nombre VARCHAR(120) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    monto_total NUMERIC(12, 2) NOT NULL,
    metodo_pago VARCHAR(40) DEFAULT 'efectivo',
    cajero_nombre VARCHAR(80) DEFAULT 'Administrador',
    fecha_hora_exacta VARCHAR(60) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ventas: Aislamiento por usuario"
    ON public.ventas
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. TABLA MERMAS
CREATE TABLE IF NOT EXISTS public.mermas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES public.productos(id) ON DELETE SET NULL,
    producto_nombre VARCHAR(120) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    costo_devaluacion NUMERIC(12, 2) NOT NULL,
    motivo TEXT NOT NULL,
    cajero_nombre VARCHAR(80) DEFAULT 'Administrador',
    fecha_hora_exacta VARCHAR(60) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mermas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mermas: Aislamiento por usuario"
    ON public.mermas
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. TABLA GASTOS FIJOS
CREATE TABLE IF NOT EXISTS public.gastos_fijos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    concepto VARCHAR(120) NOT NULL,
    monto NUMERIC(12, 2) NOT NULL CHECK (monto > 0),
    categoria VARCHAR(60) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gastos_fijos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gastos Fijos: Aislamiento por usuario"
    ON public.gastos_fijos
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. TABLA CAJEROS / PERSONAL
CREATE TABLE IF NOT EXISTS public.cajeros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(80) NOT NULL,
    pin VARCHAR(4) NOT NULL,
    turno VARCHAR(50) DEFAULT 'General',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cajeros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cajeros: Aislamiento por usuario"
    ON public.cajeros
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. TABLA CORTE Z (CIERRES DE CAJA)
CREATE TABLE IF NOT EXISTS public.cortes_z (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cajero_nombre VARCHAR(80) NOT NULL,
    monto_inicial NUMERIC(12, 2) NOT NULL DEFAULT 0,
    ventas_efectivo NUMERIC(12, 2) NOT NULL DEFAULT 0,
    ventas_tarjeta NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_esperado NUMERIC(12, 2) NOT NULL,
    efectivo_real NUMERIC(12, 2) NOT NULL,
    diferencia NUMERIC(12, 2) NOT NULL,
    notas TEXT,
    fecha_hora_exacta VARCHAR(60) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cortes_z ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cortes Z: Aislamiento por usuario"
    ON public.cortes_z
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. TABLA AUDIT LOGS (REGISTRO DE AUDITORÍA)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    accion VARCHAR(80) NOT NULL,
    modulo VARCHAR(60) NOT NULL,
    usuario_responsable VARCHAR(80) NOT NULL,
    detalles TEXT NOT NULL,
    fecha_hora_exacta VARCHAR(60) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit Logs: Aislamiento por usuario"
    ON public.audit_logs
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
