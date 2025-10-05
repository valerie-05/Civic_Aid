/*
  # Add Chat History System

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (text) - Browser fingerprint or session ID
      - `language` (text) - Language used in the chat
      - `created_at` (timestamptz)
      - `last_message_at` (timestamptz)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to chat_sessions)
      - `role` (text) - 'user' or 'assistant'
      - `content` (text) - Message content
      - `matched_scenario_id` (uuid, nullable, foreign key to crisis_scenarios)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read/write access (since we're using browser-based sessions)
    
  3. Indexes
    - Index on session_id for fast message lookups
    - Index on user_id for session history
*/

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  matched_scenario_id uuid REFERENCES crisis_scenarios(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message ON chat_sessions(last_message_at DESC);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_sessions
CREATE POLICY "Anyone can view chat sessions"
  ON chat_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create chat sessions"
  ON chat_sessions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update their chat sessions"
  ON chat_sessions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policies for chat_messages
CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create chat messages"
  ON chat_messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update chat messages"
  ON chat_messages FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete chat messages"
  ON chat_messages FOR DELETE
  TO public
  USING (true);
