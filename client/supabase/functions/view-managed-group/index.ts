// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse, transformUserId, getUserId, supabase, corsHeaders, handleOptions } from "../utils/helper.ts"

async function fetchGroupMembers(groupId: number){
  const {data, error} = await supabase
  .from("group_members")
  .select("role_id, users(fname, lname, email), groups(name, id)")
  .eq("group_id", groupId)

  if (error){
    console.error(error)
    return []
  }
  return data

}

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req)
  if (optionRes) return optionRes

  try {
    const id = await getUserId(req)
    if (!id) return errorResponse("Unauthorized", 401)
    const userId = await transformUserId(id)
    const { data: groups, error: groupIdError } = await supabase
      .from("group_members")
      .select("group_id, role_id")
      .eq("user_id", userId)
      .in("role_id", [1, 2])

    if (groupIdError || !groups) {
      console.error("Error fetching group:", groupIdError);
      return errorResponse(groupIdError?.message || "Unknown error", 403);
    }
    const leaderGroupId = groups?.find(g => g.role_id === 1)
    const coLeaderGroupId = groups?.find(g => g.role_id === 2)
    const leaderMembers = leaderGroupId ? await fetchGroupMembers(leaderGroupId.group_id) : [];
    const coLeaderMembers = coLeaderGroupId ? await fetchGroupMembers(coLeaderGroupId.group_id) : [];
    return new Response(
      JSON.stringify({leaderMembers, coLeaderMembers}),
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
