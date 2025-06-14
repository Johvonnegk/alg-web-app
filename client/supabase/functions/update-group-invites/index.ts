// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse, supabase, corsHeaders, handleOptions } from "../utils/helper.ts"

serve(async (req) => {
  const optionRes = handleOptions(req)
  if (optionRes) return optionRes

  try{
    const { invite_id, accepted } = await req.json();

    if (!invite_id || typeof accepted !== "boolean") {
          return errorResponse("Missing or invalid invite_id/accepted", 400)
        }

    const status = accepted ? "accepted" : "declined" 
    const { data: _invites, error: invitesError } = await supabase
      .from("group_invites")
      .update({updated_at: new Date().toISOString(), status})
      .eq("id", invite_id)

    if (invitesError) return errorResponse(invitesError? invitesError.message: `Error updating invites: ${invitesError}`, 500)
    
    return new Response(
      JSON.stringify({
        message: "Successfully updated invite",
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
