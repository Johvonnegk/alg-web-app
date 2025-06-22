import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface InviteToGroupResponse {
  success: boolean;
  error?: string;
}

export const useInviteToGroup = () => {
  const [loading, setLoading] = useState(false);

  const inviteToGroup = useCallback(
    async (group_id: number, email: string): Promise<InviteToGroupResponse> => {
      setLoading(true);
      try {
        const { data, error } =
          await supabase.functions.invoke<InviteToGroupResponse>(
            "invite-to-group",
            {
              body: {
                group_id,
                email,
              },
            }
          );

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: data?.success ?? true };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { inviteToGroup, loading };
};
