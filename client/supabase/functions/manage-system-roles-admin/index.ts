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
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { email, role } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, role_id")
      .eq("user_id", id)
      .maybeSingle();

    if (userError || !user)
      return errorResponse("Could not get user data", 400);

    const { data: candidate, error: candidateError } = await supabase
      .from("users")
      .select("id, role_id")
      .eq("email", email)
      .maybeSingle();

    if (candidateError || !candidate)
      return errorResponse("Candidate does not exist", 404);

    const candidateRoleId = candidate.role_id;
    if (user.role_id < candidateRoleId && Number(role) !== candidate.role_id) {
      const { error: manageError } = await supabase
        .from("users")
        .update({ role_id: role })
        .eq("id", candidate.id);

      if (manageError)
        return errorResponse(
          `An error occured while managing this user ${manageError}`,
          400
        );
      const promotionType = role < candidate.role_id ? "promotion" : "demotion";
      const { error: promoteErr } = await supabase
        .from("role_change_events")
        .insert({
          user_id: candidate.id,
          new_role: role,
          old_role: candidate.role_id,
          changed_by: user.id,
          change_type: promotionType,
        });

      if (promoteErr)
        return errorResponse(
          `An error occurred while recording promotion ${promoteErr}`,
          400
        );
    } else {
      return errorResponse("You are not eligible to manage this user", 400);
    }

    return new Response(
      JSON.stringify({
        message: "Successfully managed user",
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
