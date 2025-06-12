// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

const supabaseUrl = Deno.env.get("_SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("_SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);
  const corsHeaders = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // or restrict to your domain
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, X-Client-Info, X-Supabase-Api-Version",
      },
    });
  }

  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }
    console.log("Received user_id:", user_id);
    const { data: group , error: groupIdError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user_id)
      .not("role_id", "in", "(1,2)")
      .maybeSingle()
      
    if (groupIdError) {
      console.error("Error fetching group:", groupIdError);
      return new Response(
        JSON.stringify({ error: groupIdError.message }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }
    if (!group){
      return new Response(JSON.stringify({ error: "User is not in a group" }), 
      {
        status: 404,
        headers: corsHeaders,
      });
    }
    const groupId = group?.group_id
    console.log("Group members data:", groupId);
    const {data: groupMembers, error: groupError} = await supabase
    .from("group_members")
    .select("user_id, role_id, users(fname, lname), groups(name)")
    .eq("group_id", groupId)

    if (groupError){
      return new Response(JSON.stringify({ error: groupError.message }), 
      {
        status: 400,
        headers: corsHeaders,
      });
    }
    return new Response(
      JSON.stringify(groupMembers),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ error: e }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
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
