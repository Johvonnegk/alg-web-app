import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface ArchiveInviteResponse {
  success: boolean;
  error?: string;
}

export const useArchiveInvite = () => {
  const [loading, setLoading] = useState(false);

  const archiveInvite = useCallback(
    async (invite_id: number): Promise<ArchiveInviteResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<ArchiveInviteResponse>(
            "archive-group-invite",
            {
              body: {
                invite_id,
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

  return { archiveInvite, loading };
};
