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
    const { ministries } = await req.json();
    let userId;
    let { email, ...minNoEmail } = ministries;
    if (email) {
      const id = await getUserId(req);
      if (!id) return errorResponse("Unauthorized", 401);
      const actingUserId = await transformUserId(id);
      const { data: actingUser, error: actingError } = await supabase
        .from("group_members")
        .select("group_id, role_id, users(role_id)")
        .eq("user_id", actingUserId)
        .single();
      const actingUserRole = actingUser.users.role_id;
      const actingUserGroupRole = actingUser.role_id;

      if (!actingUser || actingError)
        return errorResponse("Cannot find acting user", 400);

      email = email.trim().toLowerCase();
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, role_id")
        .eq("email", email)
        .maybeSingle();
      if (!user || userError) return errorResponse("Could not find user", 404);
      userId = user.id;
      const userRole = user.role_id;

      const { data: userGroup, error: groupError } = await supabase
        .from("group_members")
        .select("id, role_id")
        .eq("group_id", actingUser.group_id)
        .eq("user_id", userId)
        .single();
      const userGroupRole = userGroup.role_id;

      if (!userGroup || groupError)
        return errorResponse("User is not in your group", 404);
      if (
        !actingUserRole >= userRole ||
        !actingUserGroupRole >= userGroupRole ||
        actingUserGroupRole === 4
      )
        return errorResponse("Unauthorized to add data", 400);
    } else {
      const id = await getUserId(req);
      if (!id) return errorResponse("Unauthorized", 401);
      userId = await transformUserId(id);
    }

    const { data: _ministries, error: minError } = await supabase
      .from("ministry")
      .insert({ ...minNoEmail, user_id: userId });

    if (minError)
      return errorResponse(
        minError ? minError.message : "Could not insert ministries",
        400
      );

    return new Response(
      JSON.stringify({
        message: "Successfully inserted ministries",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
