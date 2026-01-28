/*
  # Create communities table

  1. New Tables
    - `communities`
      - `id` (uuid, primary key)
      - `code` (text, unique) - community access code
      - `name` (text) - community display name
      - `background_image` (text) - URL to background image
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `communities` table
    - Add policy to allow anyone to read communities (public data)
*/

CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  background_image text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communities are readable by everyone"
  ON communities
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert test data
INSERT INTO communities (code, name, background_image) VALUES
('sierra-blanca', 'Sierra Blanca Estates', 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1600')
ON CONFLICT (code) DO NOTHING;
