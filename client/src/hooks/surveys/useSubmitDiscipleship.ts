import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { Discipleship } from "@/types/Discipleship";
interface SubmitDiscipleshipResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useSubmitDiscipleship = () => {
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (discipleship: Discipleship): Promise<SubmitDiscipleshipResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<SubmitDiscipleshipResponse>(
            "upload-discipleship",
            {
              body: {
                discipleship,
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

  return { submit, loading };
};
