// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse, getUserId, supabase, corsHeaders, handleOptions } from "../utils/helper.ts"

serve(async (req) => {
  // Handle preflight OPTIONS request for CORS
  const optionRes = handleOptions(req)
  if (optionRes) return optionRes

  try {
   const { user_id, group_id, message, email } = await req.json();
   const userId = await getUserId(user_id)
   if (!userId){
    return errorResponse(`Error getting user`, 404)
   }
   const {data: recipient, error: recError} = await supabase
   .from("users")
   .select("id")
   .eq("email", email)
   .maybeSingle()

   if (!recipient || recError){
    return errorResponse("Recipient does not exist", 400)
   }
   const recipient_id = recipient?.id
   const { data: existingInvite, error: checkError } =  await supabase
   .from("group_invites")
   .select("id")
   .eq("sender_id", userId)
   .eq("recipient_id", recipient_id)
   .eq("group_id", group_id)
   .maybeSingle()

   if (checkError){
    return errorResponse(`Check Error: ${checkError.message}`)
   }

   let inviteId;
   if (existingInvite) {
    const {data: updatedInvite, error: updateError} = await supabase
      .from("group_invites")
      .update([{message, type: "invite", updated_at: new Date().toISOString()}])
      .eq("id", existingInvite.id)
      .select()
      .maybeSingle()

      if (updateError){
        return errorResponse(`Update Error: ${updateError.message}`)
      }

      inviteId = updatedInvite?.id;
   } else {
    const {data: invite, error: invError}  = await supabase
      .from("group_invites")
      .insert([{sender_id: userId, recipient_id, group_id, type: "invite", message}])
      .select()
      .maybeSingle()

    if (invError){
      return errorResponse(`Error sending invite: ${invError}`, 400)
    }

    inviteId = invite?.id
   }
   
   
   const {data: _notification, error: notiError} =  await supabase
    .from("notifications")
    .insert([{user_id: userId, related_id: inviteId, type_id: 1}])

   if (notiError) {
    return errorResponse(`An error occured sending the notification`, 400)
   }

   return new Response(
    JSON.stringify({
      message: "Invite sent successfully",
    }), 
    {
      status: 200, headers: corsHeaders
    })
  } catch (e) {
    return errorResponse(`${e}`, 500)
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
