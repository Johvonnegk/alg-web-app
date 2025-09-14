import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  getUserId,
  transformUserId,
  errorResponse,
  supabase,
  handleOptions,
  corsHeaders,
  checkViewingAuthorization,
  checkManyViewingAuthorization,
} from "../utils/helper.ts";
serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;
  try {
    const userId = await getUserId(req);
    if (!userId) return errorResponse("Unauthorized", 401);
    const id = await transformUserId(userId);
    const {
      authorization,
      start_date,
      end_date,
      granularity,
      group_id,
      filter_id,
    } = await req.json();
    let targetId = null;
    if (filter_id) {
      targetId = await transformUserId(filter_id);
      const result = await checkViewingAuthorization(
        authorization,
        id,
        targetId
      );
      if ("error" in result) {
        const error = result.error as { message: string; code: number };
        return errorResponse(error.message, error.code);
      }
    }
    if (group_id) {
      const result = checkManyViewingAuthorization(authorization, id, group_id);
      if ("error" in result) {
        const error = result.error as { message: string; code: number };
        return errorResponse(error.message, error.code);
      }
    }
    const { data, error } = await supabase.rpc("get_ministry_over_time", {
      start_date,
      end_date,
      granularity,
      filter_user_id: targetId,
      p_group_id: group_id,
    });

    if (error) throw error;
    return new Response(
      JSON.stringify({
        message: "Fetched ministries successfully",
        data,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return errorResponse(err.message);
  }
});
