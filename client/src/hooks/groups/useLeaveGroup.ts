import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface RemoveFromGroupResponse {
  success: boolean;
  error?: string;
}

export const useLeaveGroup = () => {
  const [loading, setLoading] = useState(false);

  const leaveGroup = useCallback(
    async (group_id: number): Promise<RemoveFromGroupResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<RemoveFromGroupResponse>(
            "leave-group",
            {
              body: {
                group_id,
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

  return { leaveGroup, loading };
};
