import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";
const supabaseUrl = Deno.env.get("_SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("_SUPABASE_SERVICE_ROLE_KEY") ?? "";
export const supabase = createClient(supabaseUrl, supabaseKey);
export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // or restrict to your domain
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, apikey, X-Client-Info, X-Supabase-Api-Version",
      },
    });
  }
  return null;
}

export function errorResponse(
  message: string,
  status = 400,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders,
    },
  });
}

export async function joinGroup(group_id: number, user_id: string) {
  if (!group_id || !user_id) {
    console.error("invalid group or user id");
    return false;
  }
  const { data: _, error: joinError } = await supabase
    .from("group_members")
    .insert([{ user_id, group_id, role_id: 4 }]);

  if (joinError) return false;

  return true;
}

export async function transformUserId(user_id: string) {
  if (!user_id) {
    throw new Error("No user id provided");
  }
  const { data: user, error: getUserErr } = await supabase
    .from("users")
    .select("id")
    .eq("user_id", user_id)
    .single();

  if (getUserErr || !user) {
    throw new Error("User not found");
  }
  return user.id;
}

export async function getUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  const jwt = authHeader?.replace("Bearer ", "");
  if (!jwt) return null;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);
  if (error || !user) {
    return null;
  }
  return user.id;
}
