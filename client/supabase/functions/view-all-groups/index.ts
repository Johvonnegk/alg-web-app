import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  getUserId,
  supabase,
  corsHeaders,
  handleOptions,
} from "../utils/helper.ts";

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role_id")
      .eq("user_id", id)
      .single();

    if (userError || !user)
      return errorResponse("Could not get user data", 400);

    let query = supabase.from("groups");

    if (user.role_id === 1) {
      query = query.select(`
        id,
        name,
        description,
        created_at,
        users!owner_id(fname, lname, role_id, email, profile_icon),
        members:group_members(
          user_id,
          role_id,
          user:users(fname, lname, email, role_id, profile_icon)
        )
      `);
    } else {
      query = query.select(`
        id,
        name,
        description,
        created_at,
        users!owner_id(fname, lname, role_id, email, profile_icon)
      `);
    }

    const { data: groups, error: groupError } = await query;
    if (groupError) {
      return errorResponse(`Error fetching group: ${groupError.message}`, 400);
    }
    if (!groups) {
      return new Response(JSON.stringify({ message: "No groups found" }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(groups), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
