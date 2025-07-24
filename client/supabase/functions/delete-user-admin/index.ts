import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  errorResponse,
  getUserId,
  supabase,
  corsHeaders,
  handleOptions,
} from "../utils/helper.ts";

serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;

  try {
    const { email } = await req.json();
    const id = await getUserId(req);
    if (!id) return errorResponse("Unauthorized", 401);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role_id, id")
      .eq("user_id", id)
      .maybeSingle();

    if (userError) return errorResponse("Error while fetching user", 400);
    if (user && user.role_id !== 1) return errorResponse("Unauthorized", 401);

    const { data: remove, error: removeError } = await supabase
      .from("users")
      .select("user_id, role_id")
      .eq("email", email)
      .maybeSingle();

    if (removeError) return errorResponse("Error while fetching user", 400);
    if (remove && remove.role_id === 1)
      return errorResponse("Unauhorized", 401);

    const { error } = await supabase.auth.admin.deleteUser(remove.user_id);

    if (error)
      return errorResponse("An error occured while removing the user", 400);

    return new Response(
      JSON.stringify({
        message: "Successfully removed user",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return errorResponse(`${e}`, 500);
  }
});
