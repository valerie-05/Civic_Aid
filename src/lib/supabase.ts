import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CrisisScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  created_at: string;
  updated_at: string;
  title_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  visa_types?: string[];
  is_visa_specific?: boolean;
  importance_level?: number;
}

export interface GuidanceStep {
  id: string;
  scenario_id: string;
  step_number: number;
  title: string;
  description: string;
  is_urgent: boolean;
  created_at: string;
  title_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  description: string;
  phone_number?: string;
  is_emergency: boolean;
  categories: string[];
  languages_supported: string[];
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  votes: number;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  language: string;
  created_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  matched_scenario_id?: string;
  created_at: string;
}

export interface VisaType {
  id: string;
  code: string;
  name_translations: Record<string, string>;
  description_translations: Record<string, string>;
  country: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question_translations: Record<string, string>;
  question_order: number;
  question_type: 'single_choice' | 'multiple_choice' | 'text';
  created_at: string;
}

export interface QuizOption {
  id: string;
  question_id: string;
  option_translations: Record<string, string>;
  option_order: number;
  visa_type_mapping: string[];
  created_at: string;
}

export interface UserQuizResponse {
  id: string;
  user_id: string;
  question_id: string;
  selected_options: string[];
  text_response?: string;
  determined_visa_type?: string;
  created_at: string;
}
