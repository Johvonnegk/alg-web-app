import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse, transformUserId, getUserId, supabase, corsHeaders, handleOptions } from "../utils/helper.ts"

serve(async (req) => {
  const optionRes = handleOptions(req)
  if (optionRes) return optionRes

  try{
    const {group_id, emails} = await req.json()
    const id = await getUserId(req)
    if (!id) return errorResponse("Unauthorized", 401)
    const userId = await transformUserId(id)

    const {data: user, error: roleError} = await supabase
    .from("group_members")
    .select("role_id")
    .eq("group_id", group_id)
    .eq("user_id", userId)
    .maybeSingle()

    if (roleError || !user) return errorResponse("User does not exist", 400)
    else if (user.role_id > 3){
      return errorResponse("Unauthorized remove access", 401)
    }

    if (emails.length === 0) return errorResponse("Empty list of users", 400)
    const {data: members, error: membersError} = await supabase
    .from("users")
    .select("id")
    .in("email", emails)

    if (membersError || !members) return errorResponse("No Users exist", 400)

    const membersId = members.map((user) => user.id)

    const {data: _removedMembers, error: removeError} = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", group_id)
    .in("user_id", membersId)
    .gt("role_id", user.role_id)

    if (removeError) errorResponse("An error occured deleting the users", 400)

    return new Response(
    JSON.stringify({
      message: "Successfully removed members",
      success: true,
    }), 
    {
      status: 200, headers: corsHeaders
    })

  } catch(e){
     return errorResponse(`${e}`, 500)
  }
})
