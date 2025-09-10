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
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { name, description, gId } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);
    const { data: targetUser, error: groupError } = await supabase
      .from("group_members")
      .select("role_id")
      .eq("group_id", gId)
      .eq("user_id", userId)
      .maybeSingle();
    console.log("Group Id", gId);
    console.log("User Id: ", userId);
    if (!targetUser || groupError) {
      return errorResponse("Error getting target user", 400);
    }

    if (![1, 2].includes(targetUser.role_id))
      return errorResponse("Unauthorized", 400);

    const { error: updateErr } = await supabase
      .from("groups")
      .update({ name: name, description: description })
      .eq("id", gId);

    if (updateErr) return errorResponse("Error updating user data", 400);

    return new Response(
      JSON.stringify({
        message: `Group updated successfully`,
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
