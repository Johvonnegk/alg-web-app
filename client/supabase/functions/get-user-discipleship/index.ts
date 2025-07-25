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
  const { authorization, email } = await req.json();
  let targetId;
  const id = await getUserId(req);
  if (!id) return errorResponse("Unauthorized", 401);
  const userId = await transformUserId(id);
  if (email) {
    targetId = await transformUserEmailtoId(email);
  } else {
    targetId = userId;
  }
  const result = await checkViewingAuthorization(
    authorization,
    userId,
    targetId
  );
  if ("error" in result)
    return errorResponse(result.error.message, result.error.code);

  const { data, error } = await supabase
    .from("discipleship")
    .select("id, stage, created_at")
    .eq("user_id", targetId)
    .order("created_at", { ascending: false });

  if (error || !data)
    return errorResponse("Could not get discipleship data", 400);

  return new Response(
    JSON.stringify({
      message: "Fetched discipleship successfully",
      discipleship: data,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
});
