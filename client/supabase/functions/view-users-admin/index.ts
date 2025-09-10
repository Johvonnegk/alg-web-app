import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  getUserId,
  supabase,
  corsHeaders,
  handleOptions,
} from "../utils/helper.ts";
import { error } from "node:console";

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const { data: role, error: roleError } = await supabase
      .from("users")
      .select("role_id")
      .eq("user_id", id)
      .maybeSingle();

    if (!role || role.role_id >= 3) {
      return errorResponse("Unauthroized", 400);
    } else if (roleError) {
      return errorResponse(`Error fetching role: ${roleError.message}`);
    }

    const { data: users, error: userError } = await supabase
      .from("users")
      .select(
        "user_id, role_id, fname, lname, email, phone, address, birthday, profile_icon, created_at, confirmed"
      );

    if (userError || !users)
      return errorResponse(
        `An error occured while fetching the users: ${userError.message}`
      );
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
