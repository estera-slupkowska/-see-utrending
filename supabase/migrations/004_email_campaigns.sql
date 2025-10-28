-- Email Campaigns and Newsletter System
-- Allows admins to send bulk emails to users with tracking

-- Create email campaign status enum
CREATE TYPE email_campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed');

-- Create email campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject text NOT NULL,
  preview_text text,
  html_content text NOT NULL,
  plain_text_content text,

  -- Sender info
  from_name text NOT NULL DEFAULT 'SeeUTrending',
  from_email text NOT NULL DEFAULT 'noreply@seeutrending.com',
  reply_to text,

  -- Targeting
  target_audience jsonb NOT NULL DEFAULT '{"all": true}'::jsonb, -- {all: true} or {roles: ['creator'], filters: {}}

  -- Status and scheduling
  status email_campaign_status NOT NULL DEFAULT 'draft',
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,

  -- Tracking stats
  total_recipients integer DEFAULT 0,
  total_sent integer DEFAULT 0,
  total_delivered integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  total_bounced integer DEFAULT 0,
  total_complained integer DEFAULT 0,

  -- Metadata
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create email recipients tracking table
CREATE TABLE IF NOT EXISTS public.email_recipients (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id uuid REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,

  -- Tracking token for opens and clicks
  tracking_token uuid DEFAULT uuid_generate_v4() UNIQUE NOT NULL,

  -- Status
  sent_at timestamp with time zone,
  delivered_at timestamp with time zone,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  bounced_at timestamp with time zone,
  complained_at timestamp with time zone,

  -- Error tracking
  error_message text,

  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  UNIQUE(campaign_id, user_id)
);

-- Create email click tracking table
CREATE TABLE IF NOT EXISTS public.email_clicks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient_id uuid REFERENCES public.email_recipients(id) ON DELETE CASCADE,
  url text NOT NULL,
  clicked_at timestamp with time zone DEFAULT now(),
  user_agent text,
  ip_address inet
);

-- Indexes for performance
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX idx_email_campaigns_scheduled ON public.email_campaigns(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_email_campaigns_created_by ON public.email_campaigns(created_by);
CREATE INDEX idx_email_recipients_campaign ON public.email_recipients(campaign_id);
CREATE INDEX idx_email_recipients_tracking_token ON public.email_recipients(tracking_token);
CREATE INDEX idx_email_recipients_user ON public.email_recipients(user_id);
CREATE INDEX idx_email_clicks_recipient ON public.email_clicks(recipient_id);

-- Enable Row Level Security
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_campaigns
CREATE POLICY "Admins can view all campaigns" ON public.email_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create campaigns" ON public.email_campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update campaigns" ON public.email_campaigns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete campaigns" ON public.email_campaigns
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for email_recipients
CREATE POLICY "Admins can view all recipients" ON public.email_recipients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public access for tracking (no auth required)
CREATE POLICY "Anyone can update tracking" ON public.email_recipients
  FOR UPDATE USING (true);

-- RLS Policies for email_clicks
CREATE POLICY "Admins can view all clicks" ON public.email_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public access for click tracking (no auth required)
CREATE POLICY "Anyone can insert clicks" ON public.email_clicks
  FOR INSERT WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_email_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_email_campaigns_updated_at();

CREATE TRIGGER email_recipients_updated_at
  BEFORE UPDATE ON public.email_recipients
  FOR EACH ROW
  EXECUTE FUNCTION update_email_campaigns_updated_at();

-- Function to get campaign stats
CREATE OR REPLACE FUNCTION get_campaign_stats(campaign_uuid uuid)
RETURNS TABLE (
  total_recipients bigint,
  total_sent bigint,
  total_delivered bigint,
  total_opened bigint,
  total_clicked bigint,
  total_bounced bigint,
  total_complained bigint,
  open_rate numeric,
  click_rate numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_recipients,
    COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END)::bigint as total_sent,
    COUNT(CASE WHEN delivered_at IS NOT NULL THEN 1 END)::bigint as total_delivered,
    COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END)::bigint as total_opened,
    COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END)::bigint as total_clicked,
    COUNT(CASE WHEN bounced_at IS NOT NULL THEN 1 END)::bigint as total_bounced,
    COUNT(CASE WHEN complained_at IS NOT NULL THEN 1 END)::bigint as total_complained,
    CASE
      WHEN COUNT(CASE WHEN delivered_at IS NOT NULL THEN 1 END) > 0
      THEN (COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END)::numeric / COUNT(CASE WHEN delivered_at IS NOT NULL THEN 1 END)::numeric * 100)
      ELSE 0
    END as open_rate,
    CASE
      WHEN COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) > 0
      THEN (COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END)::numeric / COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END)::numeric * 100)
      ELSE 0
    END as click_rate
  FROM public.email_recipients
  WHERE campaign_id = campaign_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
