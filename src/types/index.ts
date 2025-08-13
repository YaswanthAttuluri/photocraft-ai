export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  credits_remaining: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  processing_mode: ProcessingMode;
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface ProcessingHistory {
  id: string;
  user_id: string;
  project_id?: string;
  processing_mode: ProcessingMode;
  input_size: number;
  output_format: string;
  processing_time: number;
  created_at: string;
}

export type ProcessingMode = 'cartoonify' | 'background' | 'passport' | 'meme' | 'enhance' | 'restore' | 'colorize';
export type Theme = 'light' | 'dark';
export type ExportFormat = 'png' | 'jpg' | 'webp' | 'pdf';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
}