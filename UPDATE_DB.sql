-- Ejecuta esto en el SQL Editor de Supabase para agregar las nuevas columnas

-- Agregar columnas a Productos
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10, 2) DEFAULT NULL;

-- Asegurar que la tabla combos está bien si no se había usado
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
