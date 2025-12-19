-- Fix PlotCard.tsx leads insertion
ALTER TABLE leads 
  ALTER COLUMN plot_id TYPE uuid USING plot_id::uuid,
  ALTER COLUMN seller_id TYPE uuid USING seller_id::uuid,
  ALTER COLUMN buyer_id SET DEFAULT gen_random_uuid();

-- Add buyer_id to the leads table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'leads' AND column_name = 'buyer_id') THEN
    ALTER TABLE leads ADD COLUMN buyer_id uuid DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Add missing columns to plots table
ALTER TABLE plots 
  ADD COLUMN IF NOT EXISTS seller_phone text,
  ADD COLUMN IF NOT EXISTS lat double precision,
  ADD COLUMN IF NOT EXISTS lng double precision,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS media_urls text[] DEFAULT '{}';

-- Create a function to handle the image_url to media_urls migration
CREATE OR REPLACE FUNCTION migrate_image_urls() RETURNS void AS $$
DECLARE
    plot_record RECORD;
BEGIN
    FOR plot_record IN SELECT id, image_url FROM plots WHERE image_url IS NOT NULL AND image_url != ''
    LOOP
        UPDATE plots 
        SET media_urls = ARRAY[plot_record.image_url]
        WHERE id = plot_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration function
SELECT migrate_image_urls();

-- Drop the function after migration
DROP FUNCTION IF EXISTS migrate_image_urls();

-- Update RLS policies if needed
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plots_is_verified ON plots(is_verified);
CREATE INDEX IF NOT EXISTS idx_plots_price ON plots(price);
CREATE INDEX IF NOT EXISTS idx_leads_plot_id ON leads(plot_id);
CREATE INDEX IF NOT EXISTS idx_leads_seller_id ON leads(seller_id);
