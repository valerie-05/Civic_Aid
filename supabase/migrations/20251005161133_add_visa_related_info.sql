/*
  # Add Visa-Related Information to Crisis Scenarios

  1. Changes
    - Add visa_types column to crisis_scenarios table
    - Add is_visa_specific flag to identify visa-related crises
    - Add importance_level for prioritizing information

  2. Purpose
    - Allow filtering crisis scenarios by visa type
    - Show relevant information based on user's visa
    - Prioritize critical visa-specific information
*/

-- Add visa-related columns to crisis_scenarios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crisis_scenarios' AND column_name = 'visa_types'
  ) THEN
    ALTER TABLE crisis_scenarios ADD COLUMN visa_types text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crisis_scenarios' AND column_name = 'is_visa_specific'
  ) THEN
    ALTER TABLE crisis_scenarios ADD COLUMN is_visa_specific boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crisis_scenarios' AND column_name = 'importance_level'
  ) THEN
    ALTER TABLE crisis_scenarios ADD COLUMN importance_level integer DEFAULT 1;
  END IF;
END $$;

-- Update existing scenarios with visa type associations
UPDATE crisis_scenarios
SET 
  visa_types = ARRAY['f1', 'm1']::text[],
  is_visa_specific = true,
  importance_level = 3
WHERE title ILIKE '%student%' OR title ILIKE '%F-1%' OR title ILIKE '%OPT%';

UPDATE crisis_scenarios
SET 
  visa_types = ARRAY['h1b', 'l1', 'o1', 'p1']::text[],
  is_visa_specific = true,
  importance_level = 3
WHERE title ILIKE '%work%' OR title ILIKE '%H-1B%' OR title ILIKE '%employment%';

UPDATE crisis_scenarios
SET 
  visa_types = ARRAY['b1b2', 'esta']::text[],
  is_visa_specific = true,
  importance_level = 2
WHERE title ILIKE '%tourist%' OR title ILIKE '%visitor%' OR title ILIKE '%B-1%' OR title ILIKE '%B-2%';

UPDATE crisis_scenarios
SET 
  visa_types = ARRAY['greencard']::text[],
  is_visa_specific = true,
  importance_level = 3
WHERE title ILIKE '%green card%' OR title ILIKE '%permanent resident%';

-- Mark ICE detention as relevant to all visa types
UPDATE crisis_scenarios
SET 
  visa_types = ARRAY['f1', 'm1', 'h1b', 'h2a', 'h2b', 'l1', 'o1', 'p1', 'j1', 'k1', 'k3', 'r1', 'i', 'b1b2', 'esta', 'greencard']::text[],
  is_visa_specific = true,
  importance_level = 5
WHERE title ILIKE '%ICE%' OR title ILIKE '%detention%' OR title ILIKE '%deportation%';