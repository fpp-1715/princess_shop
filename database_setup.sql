-- Configuración de la Base de Datos para Princess Shop

-- 1. Tabla de Categorías (Opcional pero recomendada para mejor organización)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Tabla de Combos Especiales
CREATE TABLE IF NOT EXISTS combos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Tabla de Relación: Productos dentro de Combos (Muchos a Muchos)
CREATE TABLE IF NOT EXISTS combo_items (
    combo_id UUID REFERENCES combos(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (combo_id, product_id)
);

-- 5. Perfiles de Administradores (Para el login con teléfono)
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Se enlaza con el Auth de Supabase
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. Opcional: Tabla de Contactos/Mensajes (Si quieres guardar mensajes de la web)
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- INSERCIÓN DE DATOS INICIALES BÁSICOS
INSERT INTO categories (name) VALUES ('Skincare'), ('Maquillaje'), ('Accesorios') ON CONFLICT DO NOTHING;

-- Configurar Políticas de Seguridad de Nivel de Fila (RLS - Row Level Security)
-- Esto permite que cualquier visitante vea los productos, pero solo los admins puedan modificarlos

-- Para products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Productos visibles para todos') THEN
        CREATE POLICY "Productos visibles para todos" ON products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Solo admins modifican productos') THEN
        CREATE POLICY "Solo admins modifican productos" ON products FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Para combos
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'combos' AND policyname = 'Combos visibles para todos') THEN
        CREATE POLICY "Combos visibles para todos" ON combos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'combos' AND policyname = 'Solo admins modifican combos') THEN
        CREATE POLICY "Solo admins modifican combos" ON combos FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Para categorias
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Categorias visibles para todos') THEN
        CREATE POLICY "Categorias visibles para todos" ON categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Solo admins modifican categorias') THEN
        CREATE POLICY "Solo admins modifican categorias" ON categories FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
