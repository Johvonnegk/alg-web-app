import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface RemoveFromGroupResponse {
  success: boolean;
  error?: string;
}

export const useRemoveGroupMembers = () => {
  const [loading, setLoading] = useState(false);

  const removeMembers = useCallback(
    async (
      group_id: number,
      emails: string[]
    ): Promise<RemoveFromGroupResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<RemoveFromGroupResponse>(
            "remove-group-members",
            {
              body: {
                group_id,
                emails,
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

  return { removeMembers, loading };
};
