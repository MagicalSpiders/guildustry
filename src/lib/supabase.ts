import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Get credentials from environment variables (recommended for production)
// Fallback to hardcoded values for development (NOT RECOMMENDED for production)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fntkorzsxvoqcpjurxig.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// ⚠️ SECURITY WARNING: The key you provided appears to be a service_role key.
// NEVER use service_role keys in client-side code! Use the anon (public) key instead.
// Get your anon key from: Supabase Dashboard → Settings → API → Project API keys → anon public

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
  console.warn("⚠️ Using hardcoded URL. This is only for development!");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
