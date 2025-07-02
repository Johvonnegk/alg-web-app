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
    const { data: recipient, error: recError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!recipient || recError) {
      return errorResponse("Recipient does not exist", 400);
    }
    const recipient_id = recipient?.id;

    const { data: existingMember, error: existingError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", group_id)
      .eq("user_id", recipient_id)
      .maybeSingle();

    if (existingError)
      return errorResponse("Error checking existing member", 400);
    else if (existingMember)
      return errorResponse("User is already in your group.", 400);

    const { data: existingInvite, error: checkError } = await supabase
      .from("group_invites")
      .select("id")
      .eq("sender_id", userId)
      .eq("recipient_id", recipient_id)
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
            type: "invite",
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
            recipient_id,
            group_id,
            type: "invite",
            message,
          },
        ])
        .select()
        .maybeSingle();

      if (invError) {
        return errorResponse(`Error sending invite: ${invError}`, 400);
      }

      inviteId = invite?.id;
    }

    // const { data: _notification, error: notiError } = await supabase
    //   .from("notifications")
    //   .insert([{ user_id: userId, related_id: inviteId, type_id: 1 }]);

    // if (notiError) {
    //   return errorResponse(`An error occured sending the notification`, 400);
    // }

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
