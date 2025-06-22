// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  supabase,
  corsHeaders,
  handleOptions,
} from "../utils/helper.ts";

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { user_id, fname, lname, email, phone, address, birthday } =
      await req.json();
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        { user_id, fname, lname, email, phone, address, birthday, role_id: 6 },
      ])
      .select();

    if (error && error.message.includes("duplicate key")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "user_already_exists",
        }),
        { status: 200, headers: corsHeaders } // conflict
      );
    }

    return new Response(
      JSON.stringify({
        message: `Created user ${user?.[0]?.fname} ${user?.[0]?.lname}`,
        user,
        error,
      }),
      {
        status: error ? 400 : 200,
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
