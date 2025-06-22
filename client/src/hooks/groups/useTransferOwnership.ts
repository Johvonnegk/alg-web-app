import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface TransferOwnershipResponse {
  success: boolean;
  error?: string;
}

export const useTransferOwnership = () => {
  const [loading, setLoading] = useState(false);

  const transferOwnership = useCallback(
    async (
      group_id: number,
      email: string
    ): Promise<TransferOwnershipResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<TransferOwnershipResponse>(
            "transfer-group-ownership",
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
  return { transferOwnership, loading };
};
