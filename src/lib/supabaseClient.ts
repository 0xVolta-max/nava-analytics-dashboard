import { createBrowserClient } from "@supabase/ssr";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { createServerClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please set it in your .env.local file or Vercel environment variables.");
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }
  if (!supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please set it in your .env.local file or Vercel environment variables.");
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
  }

  // For client-side usage
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// For server-side usage (e.g., API routes, Server Components)
export const createServerSupabaseClient = (cookies: ReadonlyRequestCookies) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please set it in your .env.local file or Vercel environment variables.");
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }
  if (!supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please set it in your .env.local file or Vercel environment variables.");
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookies.get(name)?.value,
      set: (name: string, value: string, options: any) => cookies.set(name, value, options),
      remove: (name: string, options: any) => cookies.delete(name, options),
    },
  });
};