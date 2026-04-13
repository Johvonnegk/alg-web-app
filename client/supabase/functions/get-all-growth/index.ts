import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  transformUserId,
  getUserId,
  supabase,
  corsHeaders,
  handleOptions,
  checkManyViewingAuthorization,
} from "../utils/helper.ts";

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;
  const { authorization } = await req.json();
  const id = await getUserId(req);
  if (!id) return errorResponse("Unauthorized", 401);
  const userId = await transformUserId(id);
  const result = await checkManyViewingAuthorization(authorization, userId);
  if ("error" in result)
    return errorResponse(result.error.message, result.error.code);

  let data;
  if (authorization === "admin") {
    const { data: growthData, error: growthErr } = await supabase
      .from("growth_tracks")
      .select(
        "user:users (user_id, fname, lname, email, role_id, profile_icon), course_name, status, completed_at",
      );

    if (!growthData || growthErr)
      return errorResponse(
        `An unexpected error occured while getting the growth data: ${growthErr}`,
      );
    data = growthData;
  } else {
    return errorResponse(`UNAUTHORIZED`, 401);
  }

  return new Response(
    JSON.stringify({
      message: "Fetched growth successfully",
      growth: data,
    }),
    {
      status: 200,
      headers: corsHeaders,
    },
  );
});
