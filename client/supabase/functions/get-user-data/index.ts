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
  checkViewingAuthorization,
  transformUserEmailtoId,
} from "../utils/helper.ts";

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;
  let { authorization, targetId } = await req.json();
  const id = await getUserId(req);
  if (!id) return errorResponse("Unauthorized", 401);
  const userId = await transformUserId(id);
  if (!targetId) targetId = userId;
  else targetId = await transformUserId(targetId);
  const result = await checkViewingAuthorization(
    authorization,
    userId,
    targetId
  );
  if ("error" in result)
    return errorResponse(result.error.message, result.error.code);

  const { data, error } = await supabase
    .from("users")
    .select(
      "user_id, role_id, fname, lname, phone, address, email, birthday, created_at"
    )
    .eq("id", targetId)
    .maybeSingle();

  if (error || !data) return errorResponse("Could not get user data", 400);

  return new Response(
    JSON.stringify({
      message: "Fetched user successfully",
      user: data,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-user-ministry' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
