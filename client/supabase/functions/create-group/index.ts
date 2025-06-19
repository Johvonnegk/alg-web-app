// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse, transformUserId, getUserId, supabase, corsHeaders, handleOptions } from "../utils/helper.ts"

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req)
  if (optionRes) return optionRes

  try {
    const { name, description } = await req.json();
    const id = await getUserId(req)
    if (!id) return errorResponse("Unauthorized", 401)
    const userId = await transformUserId(id)
    const { data: groupData , error: groupError } = await supabase
      .from("groups")
      .insert([{ owner_id: userId, name, description }])
      .select();
    
    if (groupError) {
      console.error("Error creating group:", groupError);
      return errorResponse(groupError.message)
    }
    console.log("Group created successfully:", groupData);
    const { data: _roleData, error: roleError } = await supabase
      .from("group_members")
      .insert([{ user_id: userId, group_id: groupData[0]?.id, role_id: 1 }])

    if (roleError) {
      console.error("Error assigning leadership:", roleError);
      return errorResponse(roleError.message, 400)
    }
    return new Response(
      JSON.stringify({
        message: `Group created successfully`,
        success: true,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
