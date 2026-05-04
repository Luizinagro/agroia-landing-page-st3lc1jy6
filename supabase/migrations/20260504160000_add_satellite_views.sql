ALTER TABLE public.satellite_analyses ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_satellite_views(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.satellite_analyses
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_satellite_views(UUID) TO anon, authenticated;
