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
  const { limit } = await req.json();
  const id = await getUserId(req);
  if (!id) return errorResponse("Unauthorized", 401);
  const userId = await transformUserId(id);

  const { data, error } = await supabase
    .from("gifts")
    .select(
      "id, serving, administrator, encouragement, giving, mercy, teaching, prophecy, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit || 5);

  if (error || !data) return errorResponse("Could not get gifts data", 400);

  return new Response(
    JSON.stringify({
      message: "Fetched roles successfully",
      gifts: data,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
});
