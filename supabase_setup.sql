-- 1. Create the storage bucket 'plots-media'
INSERT INTO storage.buckets (id, name, public)
VALUES ('plots-media', 'plots-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS and add policies for the bucket
-- Allow public access to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'plots-media' );

-- Allow public upload (for anon submissions)
CREATE POLICY "Anon Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'plots-media' );

-- 3. Update the 'plots' table to match the frontend schema
-- The frontend expects: name, location, size, price (text), tag, image_url, description, neighborhood_score, owner_name, owner_email, owner_phone

-- Add missing columns
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS size text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS tag text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS owner_name text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS owner_email text;
ALTER TABLE public.plots ADD COLUMN IF NOT EXISTS owner_phone text;

-- Handle 'price' column type mismatch (Frontend sends "TBD" string, Backend might be numeric)
-- We change it to text to allow arbitrary strings.
ALTER TABLE public.plots ALTER COLUMN price TYPE text;

-- Relax constraints on columns that might not be sent by frontend anymore (if they exist)
ALTER TABLE public.plots ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.plots ALTER COLUMN location_name DROP NOT NULL;

-- 4. Enable RLS on plots table
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Public Read"
ON public.plots FOR SELECT
USING ( true );

-- Allow insert access to everyone (for submissions)
CREATE POLICY "Public Insert"
ON public.plots FOR INSERT
WITH CHECK ( true );

-- Allow update/delete to everyone for demo purposes (or restrict to auth users)
-- CREATE POLICY "Admin Update" ON public.plots FOR UPDATE USING ( auth.role() = 'authenticated' );
-- CREATE POLICY "Admin Delete" ON public.plots FOR DELETE USING ( auth.role() = 'authenticated' );
