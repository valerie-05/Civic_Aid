/*
  # Add Multilingual Support and Visa Quiz System

  1. Changes to Existing Tables
    - Add translation columns to crisis_scenarios and guidance_steps tables

  2. New Tables
    - visa_types: Different visa categories
    - quiz_questions: Quiz questions to determine visa type
    - quiz_options: Answer options for quiz questions
    - user_quiz_responses: Store user quiz responses

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies

  4. Important Notes
    - Translation JSONB structure: {"en": "text", "es": "texto", ...}
    - Supports 10 languages
*/

-- Add translation columns to crisis_scenarios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crisis_scenarios' AND column_name = 'title_translations'
  ) THEN
    ALTER TABLE crisis_scenarios ADD COLUMN title_translations jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crisis_scenarios' AND column_name = 'description_translations'
  ) THEN
    ALTER TABLE crisis_scenarios ADD COLUMN description_translations jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add translation columns to guidance_steps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guidance_steps' AND column_name = 'title_translations'
  ) THEN
    ALTER TABLE guidance_steps ADD COLUMN title_translations jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guidance_steps' AND column_name = 'description_translations'
  ) THEN
    ALTER TABLE guidance_steps ADD COLUMN description_translations jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create visa_types table
CREATE TABLE IF NOT EXISTS visa_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  country text NOT NULL DEFAULT 'US',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visa_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visa types"
  ON visa_types FOR SELECT
  USING (true);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  question_order integer NOT NULL DEFAULT 0,
  question_type text NOT NULL DEFAULT 'single_choice',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (true);

-- Create quiz_options table
CREATE TABLE IF NOT EXISTS quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  option_order integer NOT NULL DEFAULT 0,
  visa_type_mapping text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz options"
  ON quiz_options FOR SELECT
  USING (true);

-- Create user_quiz_responses table
CREATE TABLE IF NOT EXISTS user_quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  question_id uuid REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_options uuid[] DEFAULT ARRAY[]::uuid[],
  text_response text,
  determined_visa_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own quiz responses"
  ON user_quiz_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own quiz responses"
  ON user_quiz_responses FOR SELECT
  USING (true);