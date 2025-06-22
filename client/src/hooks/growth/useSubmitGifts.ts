import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { Gifts } from "@/types/Gifts";
interface SubmitGiftsResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useSubmitGifts = () => {
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (gifts: Gifts): Promise<SubmitGiftsResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<SubmitGiftsResponse>("upload-gifts", {
            body: {
              gifts,
            },
          });
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

  return { submit, loading };
};
