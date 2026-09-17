-- ==============================================================================
-- AURA SEMIJÓIAS • SCHEMA SUPABASE COM POLÍTICAS DE ARMAZENAMENTO (RLS & STORAGE)
-- Execute este script no SQL Editor do seu projeto Supabase (https://app.supabase.com)
-- ==============================================================================

-- 1. EXTENSÕES ÚTEIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABELA DE PRODUTOS (SEMIJÓIAS DE ALTO PADRÃO)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    "originalPrice" NUMERIC(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT FALSE,
    "isNew" BOOLEAN DEFAULT FALSE,
    "bestSeller" BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    "reviewsCount" INTEGER DEFAULT 0,
    "stripePaymentLink" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Habilita RLS na tabela de produtos
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA (RLS) - PRODUTOS:
DROP POLICY IF EXISTS "Permitir leitura pública de produtos" ON public.products;
DROP POLICY IF EXISTS "Permitir inserção e atualização de produtos" ON public.products;

CREATE POLICY "Permitir leitura pública de produtos"
ON public.products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir inserção e atualização de produtos"
ON public.products
FOR ALL
TO public
USING (true)
WITH CHECK (true);


-- ==============================================================================
-- 3. TABELA DE PEDIDOS (ORDERS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer JSONB NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10,2) NOT NULL,
    discount NUMERIC(10,2) DEFAULT 0,
    "shippingOption" JSONB NOT NULL,
    "shippingCost" NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    "paymentMethod" TEXT DEFAULT 'stripe',
    "stripeSessionId" TEXT,
    "stripePaymentLink" TEXT,
    "trackingCode" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Habilita RLS na tabela de pedidos
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA (RLS) - PEDIDOS:
DROP POLICY IF EXISTS "Permitir criação de novos pedidos" ON public.orders;
DROP POLICY IF EXISTS "Permitir consulta de pedidos" ON public.orders;
DROP POLICY IF EXISTS "Permitir atualização de status e rastreio de pedidos" ON public.orders;

CREATE POLICY "Permitir criação de novos pedidos"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Permitir consulta de pedidos"
ON public.orders
FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir atualização de status e rastreio de pedidos"
ON public.orders
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);


-- ==============================================================================
-- 4. TABELA DE OPÇÕES DE ENTREGA (SHIPPING OPTIONS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.shipping_options (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    "estimatedDays" TEXT,
    "minFreeShippingValue" NUMERIC(10,2),
    active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Habilita RLS na tabela de entregas
ALTER TABLE public.shipping_options ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA (RLS) - OPÇÕES DE ENTREGA:
DROP POLICY IF EXISTS "Permitir leitura de opções de frete ativas" ON public.shipping_options;
DROP POLICY IF EXISTS "Permitir gerenciamento de opções de frete" ON public.shipping_options;

CREATE POLICY "Permitir leitura de opções de frete ativas"
ON public.shipping_options
FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir gerenciamento de opções de frete"
ON public.shipping_options
FOR ALL
TO public
USING (true)
WITH CHECK (true);


-- ==============================================================================
-- 5. TABELA DE CONFIGURAÇÕES GERAIS DA LOJA (STORE SETTINGS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    "storeName" TEXT DEFAULT 'Aura Semijóias',
    "announcementText" TEXT,
    "freeShippingThreshold" NUMERIC(10,2) DEFAULT 299.00,
    "stripeSecretKey" TEXT,
    "stripePublishableKey" TEXT,
    "defaultStripePaymentLink" TEXT,
    "whatsappNumber" TEXT,
    "adminPin" TEXT DEFAULT 'AUADMOK',
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Habilita RLS na tabela de configurações
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura de configurações públicas da loja" ON public.store_settings;
DROP POLICY IF EXISTS "Permitir alteração de configurações da loja" ON public.store_settings;

CREATE POLICY "Permitir leitura de configurações públicas da loja"
ON public.store_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir alteração de configurações da loja"
ON public.store_settings
FOR ALL
TO public
USING (true)
WITH CHECK (true);


-- ==============================================================================
-- 6. CONFIGURAÇÃO DE STORAGE (ARMAZENAMENTO DE FOTOS DE SEMIJÓIAS)
-- ==============================================================================

-- Cria o bucket público "product-images" para armazenar as fotos das semijóias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    10485760, -- limite de 10MB por foto
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- Nota: O RLS em storage.objects já vem ativado por padrão pelo Supabase (não execute ALTER TABLE storage.objects)

-- ==============================================================================
-- 7. POLÍTICAS DE ARMAZENAMENTO (STORAGE POLICIES) ATIVADAS
-- ==============================================================================

-- Remover políticas antigas para evitar duplicidade
DROP POLICY IF EXISTS "Imagens de produtos são publicamente acessíveis" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de fotos de semijóias" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de fotos de produtos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão de fotos de produtos" ON storage.objects;

-- POLÍTICA 1: LEITURA PÚBLICA (SELECT)
-- Qualquer visitante da loja pode carregar e visualizar as fotos das peças no site
CREATE POLICY "Imagens de produtos são publicamente acessíveis"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- POLÍTICA 2: UPLOAD DE IMAGENS (INSERT)
-- Permite o upload de novas fotos de semijóias no bucket
CREATE POLICY "Permitir upload de fotos de semijóias"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

-- POLÍTICA 3: ATUALIZAÇÃO DE IMAGENS (UPDATE)
-- Permite atualizar fotos existentes no bucket
CREATE POLICY "Permitir atualização de fotos de produtos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- POLÍTICA 4: EXCLUSÃO DE IMAGENS (DELETE)
-- Permite remover imagens associadas a semijóias excluídas
CREATE POLICY "Permitir exclusão de fotos de produtos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'product-images');


-- ==============================================================================
-- 8. CARGA INICIAL DE OPÇÕES DE ENTREGA (SEED OPCIONAL)
-- ==============================================================================
INSERT INTO public.shipping_options (id, name, description, price, "estimatedDays", "minFreeShippingValue", active)
VALUES 
    ('ship-pac', 'Correios PAC', 'Envio econômico para todo o Brasil com rastreio e seguro', 22.90, '5 a 8 dias úteis', 299.00, true),
    ('ship-sedex', 'Sedex Expresso', 'Entrega prioritária com seguro total do valor das semijóias', 45.00, '2 a 4 dias úteis', NULL, true),
    ('ship-free', 'Frete Grátis Especial', 'Cortesia Aura Semijóias para pedidos qualificados com embalagem de luxo', 0.00, '4 a 7 dias úteis', 299.00, true)
ON CONFLICT (id) DO NOTHING;

-- Configuração inicial da loja
INSERT INTO public.store_settings (id, "storeName", "announcementText", "freeShippingThreshold", "adminPin", "whatsappNumber")
VALUES (
    'default',
    'Aura Semijóias',
    'Frete Grátis para todo o Brasil em compras acima de R$ 299 • 10 Milésimos de Ouro 18k • 1 Ano de Garantia',
    299.00,
    'AUADMOK',
    '(11) 991326903'
)
ON CONFLICT (id) DO UPDATE SET "adminPin" = 'AUADMOK', "whatsappNumber" = '(11) 991326903';
