-- Create enum types for content notifications
CREATE TYPE content_badge_status AS ENUM ('active_now', 'coming_soon');
CREATE TYPE content_badge_type AS ENUM ('announcement', 'upcoming');

-- Create content_notifications table for landing page notifications
CREATE TABLE IF NOT EXISTS public.content_notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_pl text NOT NULL,
  title_en text NOT NULL,
  content_pl text NOT NULL,
  content_en text NOT NULL,
  badge_status content_badge_status NOT NULL DEFAULT 'active_now',
  badge_type content_badge_type NOT NULL DEFAULT 'announcement',
  priority integer NOT NULL DEFAULT 1,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create trailer_config table for managing the YouTube trailer
CREATE TABLE IF NOT EXISTS public.trailer_config (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  youtube_video_id text NOT NULL,
  title_pl text NOT NULL DEFAULT 'Jak to działa',
  title_en text NOT NULL DEFAULT 'How it Works',
  description_pl text,
  description_en text,
  visible boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default trailer configuration
INSERT INTO public.trailer_config (youtube_video_id, title_pl, title_en, description_pl, description_en, visible)
VALUES (
  'dQw4w9WgXcQ',
  'Jak to działa',
  'How it Works',
  'Zobacz krótki film wyjaśniający, jak działa platforma SeeUTrending',
  'Watch a short video explaining how the SeeUTrending platform works',
  true
) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.content_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trailer_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_notifications
CREATE POLICY "Public can view visible notifications" ON public.content_notifications
  FOR SELECT USING (visible = true);

CREATE POLICY "Admins can manage all notifications" ON public.content_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for trailer_config
CREATE POLICY "Public can view visible trailer" ON public.trailer_config
  FOR SELECT USING (visible = true);

CREATE POLICY "Admins can manage trailer" ON public.trailer_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_content_notifications_updated_at
  BEFORE UPDATE ON public.content_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trailer_config_updated_at
  BEFORE UPDATE ON public.trailer_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_notifications_visible ON public.content_notifications(visible);
CREATE INDEX IF NOT EXISTS idx_content_notifications_priority ON public.content_notifications(priority);

-- Comments
COMMENT ON TABLE public.content_notifications IS 'Landing page notification cards displayed in UpdatesSection';
COMMENT ON TABLE public.trailer_config IS 'Configuration for the explanatory YouTube trailer video';
