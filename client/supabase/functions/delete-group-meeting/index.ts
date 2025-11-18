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
  let { meeting_id, group_id } = await req.json();
  const id = await getUserId(req);
  if (!id) return errorResponse("Unauthorized", 401);
  const userId = await transformUserId(id);
  const result = await checkManyViewingAuthorization(
    "group_leader",
    userId,
    group_id
  );
  if ("error" in result)
    return errorResponse(result.error.message, result.error.code);
  const { error: meetingErr } = await supabase
    .from("group_meetings")
    .delete()
    .eq("id", meeting_id);
  if (meetingErr)
    return errorResponse(
      `Error deleting meeting data: ${meetingErr.message}`,
      400
    );

  const { error: attendanceErr } = await supabase
    .from("meeting_attendance")
    .delete()
    .eq("meeting_id", meeting_id);

  if (attendanceErr)
    return errorResponse(
      `Error deleting attendance data: ${attendanceErr.message}`,
      400
    );
  return new Response(
    JSON.stringify({
      message: "Deleted attendance and meeting data successfully",
      success: true,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
});
