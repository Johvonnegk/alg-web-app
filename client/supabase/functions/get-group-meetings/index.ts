import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  getUserId,
  supabase,
  corsHeaders,
  handleOptions,
  transformUserId,
  checkManyViewingAuthorization,
} from "../utils/helper.ts";

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { group_id, authorization } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);
    const result = await checkManyViewingAuthorization(
      authorization,
      userId,
      group_id
    );
    if ("error" in result)
      return errorResponse(result.error.message, result.error.code);
    if (!id) return errorResponse("Unauthorized", 401);
    const { data: meetings, error: meetErr } = await supabase
      .from("group_meetings")
      .select(
        "id, date, location, title, notes, users!created_by(fname, lname, role_id, email, profile_icon), group_id, created_at"
      )
      .eq("group_id", group_id)
      .order("date", { ascending: false });

    if (meetErr) {
      return errorResponse(`Error fetching group: ${meetErr.message}`, 400);
    }
    if (!meetings) {
      return new Response(JSON.stringify({ message: "No meetings found" }), {
        status: 200,
        headers: corsHeaders,
      });
    }
    const meetingIds = meetings.map((m) => m.id);

    const { data: attendance, error: attendanceErr } = await supabase
      .from("meeting_attendance")
      .select(
        "meeting_id, users!user_id(user_id, fname, lname, email, role_id, profile_icon), attendance"
      )
      .in("meeting_id", meetingIds);
    if (attendanceErr) {
      return errorResponse(
        `Error fetching group: ${attendanceErr.message}`,
        400
      );
    }
    if (!attendance) {
      return new Response(JSON.stringify({ message: "No attendance found" }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    const attendanceByMeetingId = attendance.reduce((acc, row) => {
      const meetingId = row.meeting_id as string;
      if (!acc[meetingId]) acc[meetingId] = [];
      acc[meetingId].push(row);
      return acc;
    }, {} as Record<string, typeof attendance>);

    const meetingsWithAttendance = meetings.map((m) => ({
      ...m,
      attendances: attendanceByMeetingId[m.id as string] ?? [],
    }));
    return new Response(JSON.stringify(meetingsWithAttendance), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
