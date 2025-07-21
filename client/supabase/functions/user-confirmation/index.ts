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
    const { id } = await req.json();
    const { data: user, error } = await supabase
      .from("users")
      .update({ confirmed: true })
      .eq("user_id", id);

    if (error) {
      console.log("Error: ", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error when confirming user",
        }),
        { status: 200, headers: corsHeaders } // conflict
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
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
