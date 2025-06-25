import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface joinGroupResponse {
  success: boolean;
  error?: string;
}

export const useJoinGroup = () => {
  const [loading, setLoading] = useState(false);

  const join = useCallback(
    async (group_id: number, email: string): Promise<joinGroupResponse> => {
      setLoading(true);
      try {
        const { data, error } =
          await supabase.functions.invoke<joinGroupResponse>(
            "request-to-join-group",
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

  return { join, loading };
};
