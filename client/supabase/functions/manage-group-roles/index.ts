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

async function isRoleTaken(
  group_id: number,
  role_id: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", group_id)
    .eq("role_id", role_id);

  return (data && data.length > 0) || !!error;
}

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { group_id, promotion, email } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);

    const { data: user, error: memberError } = await supabase
      .from("group_members")
      .select("role_id")
      .eq("group_id", group_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (memberError || !user)
      return errorResponse("You are not in this group", 400);

    const { data: candidate, error: candidateError } = await supabase
      .from("users")
      .select("id, role_id")
      .eq("email", email)
      .maybeSingle();

    if (candidateError || !candidate)
      return errorResponse("Candidate does not exist", 404);

    const { data: promoted, error: promotedError } = await supabase
      .from("group_members")
      .select("id, role_id")
      .eq("group_id", group_id)
      .eq("user_id", candidate.id)
      .maybeSingle();

    if (!promoted || promotedError)
      return errorResponse("Candidate does not exist in your group", 404);

    const candidateRoleId = promoted.role_id;
    if (user.role_id < candidateRoleId) {
      if (promotion && candidateRoleId > 2) {
        let success = false;

        for (let offset = 1; offset <= 2; offset++) {
          const newRoleId = candidateRoleId - offset;
          if (newRoleId < 1) break;
          const roleTaken = await isRoleTaken(group_id, newRoleId);
          if (!roleTaken) {
            const { error: promotionError } = await supabase
              .from("group_members")
              .update({ role_id: newRoleId })
              .eq("id", promoted.id);

            if (promotionError)
              return errorResponse("Error promotiong user.", 400);

            success = true;
            break;
          }
        }

        if (!success) {
          return errorResponse("No available upper roles fopr user");
        }
      } else if (!promotion && candidateRoleId < 4) {
        let success = false;

        for (let offset = 1; offset <= 2; offset++) {
          const newRoleId = candidateRoleId + offset;
          if (newRoleId > 4) break;
          const roleTaken = await isRoleTaken(group_id, newRoleId);
          if (!roleTaken) {
            const { error: promotionError } = await supabase
              .from("group_members")
              .update({ role_id: newRoleId })
              .eq("id", promoted.id);

            console.error(promotionError?.message);
            if (promotionError)
              return errorResponse("Error demoting user.", 400);

            success = true;
            break;
          }
        }

        if (!success) {
          return errorResponse("No available lower roles fopr user");
        }
      } else {
        return errorResponse("Promotion out of bounds", 400);
      }
    } else {
      return errorResponse("You are not eligible to manage this member", 400);
    }

    return new Response(
      JSON.stringify({
        message: "Successfully promoted members",
        success: true,
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
