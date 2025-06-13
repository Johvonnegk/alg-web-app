// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse, getUserId, supabase, corsHeaders, handleOptions } from "../utils/helper.ts"

serve(async (req) => {
  const optionRes = handleOptions(req)
  if (optionRes) return optionRes

  try{
    const { user_id } = await req.json();
    const userId = await getUserId(user_id)
    if (!userId) return errorResponse(`Error getting user`, 404)

    const { data: role, error: roleError } = await supabase
      .from("group_members")
      .select("role_id")
      .eq("user_id", userId)

    if (roleError || !role) return errorResponse(roleError.message, 400)
    
    return new Response(
      JSON.stringify({
        message: "Fetched roles successfully"
      }), {status: 200, headers: corsHeaders}
    )
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-ownership' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
