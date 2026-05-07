-- Migration: Google Ads Integration
-- Crea tablas para almacenar tokens de usuarios y trackear campañas

-- Tabla para almacenar credenciales de integraciones (OAuth tokens, IDs de cuenta)
CREATE TABLE IF NOT EXISTS public.user_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- Ej: 'google_ads'
    access_token TEXT,
    refresh_token TEXT,
    platform_account_id TEXT, -- El 'client-customer-id' en Google Ads
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- Habilitar RLS en user_integrations
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own integrations"
    ON public.user_integrations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations"
    ON public.user_integrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations"
    ON public.user_integrations FOR UPDATE
    USING (auth.uid() = user_id);

-- Tabla para trackear las campañas publicadas
CREATE TABLE IF NOT EXISTS public.campaign_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- Ej: 'google_ads', 'meta'
    external_campaign_id TEXT NOT NULL, -- ID de la campaña en Google/Meta
    campaign_name TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING', -- PENDING, IN_REVIEW, LIVE, PAUSED, REJECTED, ERROR
    metrics JSONB DEFAULT '{}'::jsonb, -- Impresiones, clics, gasto
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en campaign_tracking
ALTER TABLE public.campaign_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tracked campaigns"
    ON public.campaign_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracked campaigns"
    ON public.campaign_tracking FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracked campaigns"
    ON public.campaign_tracking FOR UPDATE
    USING (auth.uid() = user_id);

-- Función para actualizar el 'updated_at' automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para las nuevas tablas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_user_integrations') THEN
    CREATE TRIGGER set_updated_at_user_integrations
    BEFORE UPDATE ON public.user_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_campaign_tracking') THEN
    CREATE TRIGGER set_updated_at_campaign_tracking
    BEFORE UPDATE ON public.campaign_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
