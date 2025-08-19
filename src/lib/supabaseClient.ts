
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.VITE_SUPABAE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
  );

