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
    const { promotion, email } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role_id")
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
    if (user.role_id < candidateRoleId) {
      if (promotion && candidateRoleId > 1) {
        const newRoleId = candidateRoleId - 1;
        const { data: _promote, error: promotionError } = await supabase
          .from("users")
          .update({ role_id: newRoleId })
          .eq("id", candidate.id);

        if (promotionError)
          return errorResponse(
            `Error promoting user: ${promotionError.message}`,
            400
          );
      } else if (!promotion && candidateRoleId < 6) {
        const newRoleId = candidateRoleId + 1;
        const { data: _promote, error: promotionError } = await supabase
          .from("users")
          .update({ role_id: newRoleId })
          .eq("id", candidate.id);

        if (promotionError)
          return errorResponse(
            `Error promoting user: ${promotionError.message}`,
            400
          );
      } else {
        return errorResponse("Promotion out of bounds", 400);
      }
    } else {
      return errorResponse("You are not eligible to manage this user", 400);
    }

    return new Response(
      JSON.stringify({
        message: "Successfully promoted user",
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
