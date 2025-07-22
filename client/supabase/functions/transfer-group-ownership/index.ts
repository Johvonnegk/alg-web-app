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
    const { group_id, email } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);

    const { data: newOwnerUser, error: ownerError } = await supabase
      .from("users")
      .select("id, role_id")
      .eq("email", email)
      .single();

    if (ownerError || !newOwnerUser)
      return errorResponse("Error finding new owner", 400);

    const newOwnerId = newOwnerUser.id;

    if (newOwnerUser.role_id >= 5)
      return errorResponse("User cannot manage a group", 400);

    const { data: newOwner, error: newOwnerError } = await supabase
      .from("groups")
      .update({ owner_id: newOwnerId })
      .eq("id", group_id)
      .select("owner_id")
      .maybeSingle();

    if (newOwnerError || !newOwner)
      return errorResponse("Error defining ownership: ", 400);

    const updates = [
      { user_id: userId, role_id: 4 },
      { user_id: newOwnerId, role_id: 1 },
    ];
    const results = await Promise.all(
      updates.map(({ user_id, role_id }) =>
        supabase
          .from("group_members")
          .update({ role_id: role_id })
          .eq("user_id", user_id)
      )
    );
    let resultError = false;
    results.forEach((result, index) => {
      if (result.error) {
        resultError = true;
        console.error(`Update ${index} failed:`, result.error.message);
      } else {
        console.log(`Update ${index} succeeded:`, result.data);
      }
    });

    if (resultError)
      return errorResponse(
        "There was an error while transferring ownership.",
        500
      );

    return new Response(
      JSON.stringify({
        message: "Successfully transferred ownership.",
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
