import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  getUserId,
  transformUserId,
  errorResponse,
  supabase,
  handleOptions,
  corsHeaders,
} from "../utils/helper.ts";
serve(async (req) => {
  const optionRes = handleOptions(req);
  if (optionRes) return optionRes;
  try {
    const userId = await getUserId(req);
    if (!userId) return errorResponse("Unauthorized", 401);
    const id = await transformUserId(userId);
    const { data: admin, error: adminError } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", id)
      .maybeSingle();

    if (adminError)
      return errorResponse("An error occured fetching auth user", 400);
    if (admin.role_id !== 1) return errorResponse("Unauthorized", 401);
    const { start_date, end_date } = await req.json();
    console.log("Start date: ", start_date);
    console.log("End date: ", end_date);
    const { data, error } = await supabase
      .from("role_change_events")
      .select("new_role, change_type, old_role.count()")
      .gte("created_at", start_date)
      .lte("created_at", end_date)
      .order("new_role", { ascending: true })
      .order("change_type", { ascending: false });

    if (error) return errorResponse(`Error: ${error.message}`, 400);
    console.log("Data: ", data);
    return new Response(
      JSON.stringify({
        message: "Fetched role change stats successfully",
        data,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return errorResponse(err.message);
  }
});
