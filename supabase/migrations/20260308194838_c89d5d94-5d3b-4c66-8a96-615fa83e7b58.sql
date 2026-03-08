
-- ============================================================
-- Campaigns table
-- ============================================================
CREATE TABLE public.campaigns (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL,
  name          TEXT NOT NULL,
  subject       TEXT NOT NULL DEFAULT '',
  body          TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'draft',
  export_id     UUID REFERENCES public.lead_exports(id) ON DELETE SET NULL,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns"   ON public.campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON public.campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON public.campaigns FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Campaign leads (tracks which leads are in a campaign + status)
-- ============================================================
CREATE TABLE public.campaign_leads (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id  UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL,
  lead_index   INTEGER NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  role         TEXT,
  email        TEXT,
  industry     TEXT,
  fit_reason   TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  contacted_at TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaign_leads"   ON public.campaign_leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaign_leads" ON public.campaign_leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaign_leads" ON public.campaign_leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaign_leads" ON public.campaign_leads FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Lead pipeline (Kanban board)
-- ============================================================
CREATE TABLE public.lead_pipeline (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL,
  export_id    UUID REFERENCES public.lead_exports(id) ON DELETE SET NULL,
  lead_index   INTEGER NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  role         TEXT,
  email        TEXT,
  industry     TEXT,
  fit_reason   TEXT,
  score        INTEGER,
  stage        TEXT NOT NULL DEFAULT 'new',
  notes        TEXT,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_pipeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pipeline"   ON public.lead_pipeline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pipeline" ON public.lead_pipeline FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pipeline" ON public.lead_pipeline FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pipeline" ON public.lead_pipeline FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_lead_pipeline_updated_at
  BEFORE UPDATE ON public.lead_pipeline
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
