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
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;
  try {
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);
    const { data: role, error: roleError } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", userId)
      .maybeSingle();
    if (roleError || !role)
      return errorResponse(
        roleError ? roleError.message : "Cannot find user",
        400
      );
    return new Response(
      JSON.stringify({
        message: "Fetched roles successfully",
        role_id: role?.role_id,
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
