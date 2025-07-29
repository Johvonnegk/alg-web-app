import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { Growth } from "@/types/Growth";
interface SubmitGrowthResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useSubmitGrowth = () => {
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (growth: {
      email: string;
      courses: {
        course_name: string;
        status: "passed" | "incomplete" | "failed";
      }[];
    }): Promise<SubmitGrowthResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<SubmitGrowthResponse>(
            "upload-growth",
            {
              body: {
                growth,
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
