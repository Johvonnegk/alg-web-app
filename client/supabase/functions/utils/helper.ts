import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";
const supabaseUrl = Deno.env.get("_SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("_SUPABASE_SERVICE_ROLE_KEY") ?? "";
export const supabase = createClient(supabaseUrl, supabaseKey);
export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // or restrict to your domain
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, apikey, X-Client-Info, X-Supabase-Api-Version",
      },
    });
  }
  return null;
}

export function errorResponse(
  message: string,
  status = 400,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders,
    },
  });
}

export async function joinGroup(group_id: number, user_id: string) {
  if (!group_id || !user_id) {
    console.error("invalid group or user id");
    return false;
  }
  const { data: _, error: joinError } = await supabase
    .from("group_members")
    .insert([{ user_id, group_id, role_id: 4 }]);

  if (joinError) return false;

  return true;
}

export async function transformUserId(user_id: string) {
  if (!user_id) {
    throw new Error("No user id provided");
  }
  const { data: user, error: getUserErr } = await supabase
    .from("users")
    .select("id")
    .eq("user_id", user_id)
    .single();

  if (getUserErr || !user) {
    throw new Error("User not found");
  }
  return user.id;
}

export async function getUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  const jwt = authHeader?.replace("Bearer ", "");
  if (!jwt) return null;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);
  if (error || !user) {
    return null;
  }
  return user.id;
}
export async function checkManyViewingAuthorization(
  authorization: string,
  userId: string,
  groupId?: string
): Promise<
  { success: boolean } | { error: { message: string; code: number } }
> {
  if (authorization === "admin") {
    const { data: user, error: adminError } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", userId)
      .maybeSingle();

    if (adminError)
      return { error: { message: "An unexpected error occured", code: 400 } };
    if (user && user.role_id !== 1)
      return { error: { message: "Unauthorized", code: 401 } };

    return { success: true };
  } else if (groupId && authorization === "group_leader") {
    const leadIds = [1, 2];
    const { data: leader, error: leadErr } = await supabase
      .from("group_members")
      .select("role_id")
      .eq("user_id", userId)
      .eq("group_id", groupId)
      .maybeSingle();

    if (!leader || leadErr)
      return { error: { message: "User is not in a group", code: 400 } };

    if (!leadIds.includes(leader.role_id))
      return { error: { message: "Unauthorized", code: 403 } };

    return { success: true };
  } else {
    return { error: { message: "Bad request", code: 403 } };
  }
}
export async function checkViewingAuthorization(
  authorization: string,
  userId: string,
  targetId: string
): Promise<
  { success: boolean } | { error: { message: string; code: number } }
> {
  const CO_LEADER_ROLE_ID = 2;
  if (userId === targetId) return { success: true };
  if (authorization === "admin" && targetId) {
    const { data: user, error: adminError } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", userId)
      .maybeSingle();

    if (adminError)
      return { error: { message: "An unexpected error occured", code: 400 } };
    if (user && user.role_id !== 1)
      return { error: { message: "Unauthorized", code: 401 } };

    return { success: true };
  } else if (authorization === "group_leader" && targetId) {
    // Step 1: Find the group that targetId belongs to
    const { data: targetMember, error: targetError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", targetId)
      .neq("role_id", 1)
      .maybeSingle();

    if (targetError || !targetMember)
      return {
        error: { message: "Target user not found or not viewable", code: 404 },
      };

    const targetGroupId = targetMember.group_id;

    // Step 2: Check if userId is either the group owner OR a co-leader in the same group
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("id, owner_id")
      .eq("id", targetGroupId)
      .maybeSingle();

    if (groupError || !group)
      return { error: { message: "Group not found", code: 404 } };

    const isOwner = group.owner_id === userId;

    if (isOwner) return { success: true };

    // Step 3: Check if userId is a co-leader (role_id === 2) in the same group
    const { data: coLeader, error: coError } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", targetGroupId)
      .eq("user_id", userId)
      .eq("role_id", CO_LEADER_ROLE_ID)
      .maybeSingle();

    if (coError)
      return {
        error: { message: "Error checking co-leader status", code: 400 },
      };

    if (!coLeader)
      return {
        error: {
          message: "Unauthorized (not a leader of this group)",
          code: 403,
        },
      };

    return { success: true };
  } else {
    return { error: { message: "Bad request", code: 403 } };
  }
}

export async function transformUserEmailtoId(
  email: string
): Promise<string | null> {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (userError || !user) return null;

  return user.id;
}
