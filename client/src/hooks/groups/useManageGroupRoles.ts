import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface ManageGroupRolesResponse {
  success: boolean;
  error?: string;
}

export const useManageGroupRoles = () => {
  const [loading, setLoading] = useState(false);

  const handlePromotion = useCallback(
    async (
      group_id: number,
      promotion: boolean,
      email: string
    ): Promise<ManageGroupRolesResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<ManageGroupRolesResponse>(
            "manage-group-roles",
            {
              body: {
                group_id,
                promotion,
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
  return { handlePromotion, loading };
};
