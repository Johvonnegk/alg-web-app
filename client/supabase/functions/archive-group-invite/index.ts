import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  supabase,
  corsHeaders,
  handleOptions,
} from "../utils/helper.ts";

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { invite_id } = await req.json();
    const { data, error } = await supabase
      .from("group_invites")
      .update({ archive: true })
      .eq("id", invite_id)
      .select("id");

    if (error || !data) {
      return errorResponse("Could not archive invite", 400);
    }

    return new Response(
      JSON.stringify({
        message: "Successfully archived invite.",
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
