import { createClient } from "@supabase/supabase-js"

// Optional: If you generated Supabase types using the CLI
// import type { Database } from "../types/supabase"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Use this if you have generated types:
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Otherwise:
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
