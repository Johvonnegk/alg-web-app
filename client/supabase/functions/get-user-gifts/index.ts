import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  transformUserId,
  getUserId,
  supabase,
  corsHeaders,
  handleOptions,
  checkViewingAuthorization,
  transformUserEmailtoId,
} from "../utils/helper.ts";

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;
  let { authorization, targetId } = await req.json();
  const id = await getUserId(req);
  if (!id) return errorResponse("Unauthorized", 401);
  const userId = await transformUserId(id);
  if (!targetId) targetId = userId;
  else targetId = await transformUserId(targetId);
  const result = await checkViewingAuthorization(
    authorization,
    userId,
    targetId
  );
  if ("error" in result)
    return errorResponse(result.error.message, result.error.code);

  const { data, error } = await supabase
    .from("gifts")
    .select(
      "id, serving, administrator, encouragement, giving, mercy, teaching, prophecy, created_at"
    )
    .eq("user_id", targetId)
    .order("created_at", { ascending: false });

  if (error || !data) return errorResponse("Could not get gifts data", 400);

  return new Response(
    JSON.stringify({
      message: "Fetched gifts successfully",
      gifts: data,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
});
