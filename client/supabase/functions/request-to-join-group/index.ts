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
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { group_id, message, email } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);
    const userId = await transformUserId(id);
    const { data: host, error: hostError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!host || hostError) {
      return errorResponse("Host group does not exist", 400);
    }
    const hostId = host?.id;

    const { data: existingMember, error: existingError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", group_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError)
      return errorResponse("Error checking existing member", 400);
    else if (existingMember)
      return errorResponse("You are already in this group.", 400);

    const { data: existingInvite, error: checkError } = await supabase
      .from("group_invites")
      .select("id")
      .eq("sender_id", userId)
      .eq("recipient_id", hostId)
      .eq("group_id", group_id)
      .maybeSingle();

    if (checkError) {
      return errorResponse(`Check Error: ${checkError.message}`);
    }

    let inviteId;
    if (existingInvite) {
      const { data: updatedInvite, error: updateError } = await supabase
        .from("group_invites")
        .update([
          {
            message,
            type: "join_request",
            status: "pending",
            updated_at: new Date().toISOString(),
            archive: false,
          },
        ])
        .eq("id", existingInvite.id)
        .select()
        .maybeSingle();

      if (updateError) {
        return errorResponse(`Update Error: ${updateError.message}`);
      }

      inviteId = updatedInvite?.id;
    } else {
      const { data: invite, error: invError } = await supabase
        .from("group_invites")
        .insert([
          {
            sender_id: userId,
            recipient_id: hostId,
            group_id,
            type: "join_request",
            message,
          },
        ])
        .select()
        .maybeSingle();

      if (invError) {
        return errorResponse(`Error sending invite: ${invError.message}`, 400);
      }

      inviteId = invite?.id;
    }

    const { data: _notification, error: notiError } = await supabase
      .from("notifications")
      .insert([{ user_id: userId, related_id: inviteId, type_id: 1 }]);

    if (notiError) {
      return errorResponse(`An error occured sending the notification`, 400);
    }

    return new Response(
      JSON.stringify({
        message: "Invite sent successfully",
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
