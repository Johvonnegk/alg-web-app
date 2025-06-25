import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { Ministries } from "@/types/Ministries";
interface SubmitMinistriesResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const useSubmitMinistry = () => {
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (ministries: Ministries): Promise<SubmitMinistriesResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<SubmitMinistriesResponse>(
            "upload-ministry",
            {
              body: {
                ministries: {
                  outreach: ministries.outreach,
                  tech_arts: ministries.techArts,
                  worship: ministries.worship,
                  small_groups: ministries.smallGroups,
                  children_youth: ministries.youth,
                  follow_up: ministries.followUp,
                  impressions: ministries.impressions,
                  email: ministries.email,
                },
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
