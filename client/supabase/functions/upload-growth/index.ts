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
    const { growth } = await req.json();
    if (growth.courses.length <= 0 || !growth.email)
      return errorResponse("No data to process", 400);
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role_id, id")
      .eq("user_id", id)
      .maybeSingle();

    if (userError || !user)
      return errorResponse("Could not load acting user data", 400);
    if (user.role_id !== 1) return errorResponse("Unauthorized", 401);

    const { data: targetUser, error: targetError } = await supabase
      .from("users")
      .select("id")
      .eq("email", growth.email)
      .maybeSingle();

    if (targetError) return errorResponse("An unexpected error occured", 400);
    if (!targetUser) return errorResponse("Target does not exist", 404);

    const targetId = targetUser.id;

    for (const course of growth.courses) {
      const { data: _, error: growthError } = await supabase
        .from("growth_tracks")
        .update({
          status: course.status,
          completed_at: new Date(),
        })
        .eq("user_id", targetId)
        .eq("course_name", course.course_name);

      if (growthError)
        return errorResponse(
          "An error occured while updating the growth tracks"
        );
    }

    return new Response(
      JSON.stringify({
        message: "Successfully inserted growth tracks",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
