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
  let { group_id, date, location, title, notes, attendances } =
    await req.json();
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
  const { data: meetingData, error: meetingErr } = await supabase
    .from("group_meetings")
    .insert({
      group_id: group_id,
      created_by: userId,
      date: date,
      location: location,
      title: title,
      notes: notes,
    })
    .select("id")
    .single();
  if (meetingErr)
    return errorResponse(
      `Error inserting meeting data: ${meetingErr.message}`,
      400
    );
  const rows = attendances.map((a) => ({
    meeting_id: meetingData.id,
    user_id: a.user_id,
    attendance: a.attendance,
  }));

  const { _, error: attendanceErr } = await supabase
    .from("meeting_attendance")
    .insert(rows);

  if (attendanceErr)
    return errorResponse(
      `Error inserting attendance data: ${attendanceErr.message}`,
      400
    );
  return new Response(
    JSON.stringify({
      message: "Recorded meeting data successfully",
      success: true,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
});
