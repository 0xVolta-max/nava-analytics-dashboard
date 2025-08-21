import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL environment variable. Please set it in your .env.local file.");
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing VITE_SUPABASE_ANON_KEY environment variable. Please set it in your .env.local file.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};