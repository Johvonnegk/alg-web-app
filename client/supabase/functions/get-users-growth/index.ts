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
import { group } from "node:console";

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;
  const { authorization, groupId } = await req.json();
  const id = await getUserId(req);
  if (!id) return errorResponse("Unauthorized", 401);
  const userId = await transformUserId(id);
  const result = await checkManyViewingAuthorization(
    authorization,
    userId,
    groupId
  );
  if ("error" in result)
    return errorResponse(result.error.message, result.error.code);

  let data;
  if (
    (authorization === "admin" && groupId) ||
    (authorization === "group_leader" && groupId)
  ) {
    const { data: groupMembers, error: groupErr } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId);

    if (!groupMembers || groupErr)
      return errorResponse(
        `An error occurred while fetching group members: ${groupErr}`,
        400
      );
    const userIds = groupMembers.map((m) => m.user_id);
    const { data: growthData, error: growthErr } = await supabase
      .from("growth_tracks")
      .select(
        "user:users (fname, lname, email, role_id), course_name, status, completed_at"
      )
      .in("user_id", userIds);

    if (!growthData || growthErr)
      return errorResponse(
        `An unexpected error occured while getting the growth data: ${growthErr}`
      );
    data = growthData;
  } else if (authorization === "admin" && !groupId) {
    const { data: growthData, error: growthErr } = await supabase
      .from("growth_tracks")
      .select(
        "user:users (fname, lname, email, role_id), course_name, status, completed_at"
      );

    if (!growthData || growthErr)
      return errorResponse(
        `An unexpected error occured while getting the growth data: ${growthErr}`
      );

    data = growthData;
  }

  return new Response(
    JSON.stringify({
      message: "Fetched growth successfully",
      growth: data,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
});
