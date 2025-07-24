// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  transformUserId,
  getUserId,
  supabase,
  corsHeaders,
  handleOptions,
} from "../utils/helper.ts";

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);

    const { data: role, error: roleError } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", userId)
      .maybeSingle();

    if (roleError || !role) return errorResponse(`${roleError?.message}`, 400);
    let allowed;
    role.role_id < 5 ? (allowed = true) : (allowed = false);
    return new Response(
      JSON.stringify({
        message: "Fetched create access",
        allowed,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
