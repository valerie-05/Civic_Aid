/*
  # Immigration Crisis Guidance System Schema

  ## Overview
  Creates database structure for an immigration and crisis guidance platform that helps
  immigrants, families, government workers, and visa holders navigate difficult situations.

  ## New Tables
  
  ### 1. `crisis_scenarios`
  Stores different types of crisis situations users may face
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Crisis scenario title
  - `description` (text) - Detailed description
  - `category` (text) - Category (ice_detention, visa_issues, government_shutdown, deportation, etc.)
  - `severity` (text) - Severity level (critical, high, medium, low)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `guidance_steps`
  Step-by-step guidance for each crisis scenario
  - `id` (uuid, primary key) - Unique identifier
  - `scenario_id` (uuid, foreign key) - Links to crisis_scenarios
  - `step_number` (integer) - Order of the step
  - `title` (text) - Step title
  - `description` (text) - Detailed instructions
  - `is_urgent` (boolean) - Whether this step is time-critical
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `resources`
  External resources, organizations, and helpful links
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Resource name
  - `url` (text) - Resource URL
  - `description` (text) - What this resource provides
  - `phone_number` (text, optional) - Contact phone number
  - `is_emergency` (boolean) - Whether this is an emergency resource
  - `categories` (text array) - Related categories
  - `languages_supported` (text array) - Languages available
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `faqs`
  Frequently asked questions and answers
  - `id` (uuid, primary key) - Unique identifier
  - `question` (text) - The question
  - `answer` (text) - Detailed answer
  - `category` (text) - Related category
  - `votes` (integer) - Helpfulness votes
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. `translations`
  Multi-language support for all content
  - `id` (uuid, primary key) - Unique identifier
  - `content_type` (text) - Type of content (scenario, step, resource, faq)
  - `content_id` (uuid) - ID of the content being translated
  - `language_code` (text) - Language code (es, zh, fr, ar, etc.)
  - `field_name` (text) - Which field is translated
  - `translated_text` (text) - The translation
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for all guidance content (anyone can read without authentication)
  - No write access through policies (content managed by administrators through backend)

  ## Notes
  - All timestamps use timestamptz for proper timezone handling
  - Foreign keys ensure data integrity
  - Indexes added for performance on frequently queried fields
*/

-- Create crisis_scenarios table
CREATE TABLE IF NOT EXISTS crisis_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  severity text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guidance_steps table
CREATE TABLE IF NOT EXISTS guidance_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES crisis_scenarios(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  is_urgent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  phone_number text,
  is_emergency boolean DEFAULT false,
  categories text[] DEFAULT '{}',
  languages_supported text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  language_code text NOT NULL,
  field_name text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guidance_steps_scenario ON guidance_steps(scenario_id);
CREATE INDEX IF NOT EXISTS idx_crisis_scenarios_category ON crisis_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_resources_categories ON resources USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(content_type, content_id, language_code);

-- Enable Row Level Security
ALTER TABLE crisis_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access to crisis scenarios"
  ON crisis_scenarios FOR SELECT
  USING (true);

CREATE POLICY "Public read access to guidance steps"
  ON guidance_steps FOR SELECT
  USING (true);

CREATE POLICY "Public read access to resources"
  ON resources FOR SELECT
  USING (true);

CREATE POLICY "Public read access to FAQs"
  ON faqs FOR SELECT
  USING (true);

CREATE POLICY "Public read access to translations"
  ON translations FOR SELECT
  USING (true);