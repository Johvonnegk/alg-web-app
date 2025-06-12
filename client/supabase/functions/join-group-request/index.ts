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
    const { user_id, group_id, email } = await req.json();
    const { data: targetData, error: targetError } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", email)
    .single()
    if (targetError){
      console.error("Error matching fetching user: ", targetError)
      return new Response(
        JSON.stringify({ error: targetError.message }),
        {
          status: 403,
          headers: corsHeaders,
        }
      );
    }
    if (!targetData || targetData == null){
            return new Response(
        JSON.stringify({ error: "No user found" }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }
    console.log("Target Data: ", targetData)
    const {data: _, error: joinRequestError} = await supabase
    .from("requests")
    .insert({
      target_id: targetData?.id, 
      user_id: user_id, 
      type: "request_join_group", 
      group_id: group_id 
    })

    if (joinRequestError){
      return new Response(
        JSON.stringify({ error: "Error adding user" }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }
    return new Response(JSON.stringify({
      message: `Join request sent successfully`,
      joinRequestError,
    }))
  } catch (e){
    return new Response(
      JSON.stringify({ error: e}),
      {
        status: 500,
        headers: corsHeaders
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
