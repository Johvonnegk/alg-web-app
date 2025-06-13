import { supabase } from "../supabaseClient";
import { useState, useCallback } from "react";

export const useInviteToGroup = () => {
  const [loading, setLoading] = useState(false);

  const inviteToGroup = useCallback(async (group_id, email) => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return { success: false, error: userError || "User not found" };
      }

      const { data: _invite, error: invError } =
        await supabase.functions.invoke("invite-to-group", {
          body: {
            user_id: user?.id,
            group_id: group_id,
            email: email,
          },
        });

      if (invError) {
        return { success: false, error: invError };
      }

      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  return { inviteToGroup, loading };
};
