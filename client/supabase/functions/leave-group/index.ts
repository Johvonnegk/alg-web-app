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
    const { group_id } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);

    const { data: ownership, error: ownershipErr } = await supabase
      .from("group_members")
      .select("role_id")
      .eq("group_id", group_id)
      .eq("user_id", userId)
      .single();

    if (!ownership || ownershipErr)
      return errorResponse("Could not find user", 400);

    const { data: _user, error: userError } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", group_id)
      .eq("user_id", userId);

    if (userError) return errorResponse("Could not find user", 400);

    if (ownership.role_id === 1) {
      const { data: _group, error: groupError } = await supabase
        .from("groups")
        .delete()
        .eq("owner_id", userId);

      if (groupError)
        errorResponse("There was an error removing the group", 400);
    }

    return new Response(
      JSON.stringify({
        message: "Successfully left group",
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
