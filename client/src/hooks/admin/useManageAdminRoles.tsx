import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface ManageAdminRolesResponse {
  success: boolean;
  error?: string;
}

export const useManageAdminRoles = () => {
  const [loading, setLoading] = useState(false);

  const handlePromotion = useCallback(
    async (
      promotion: boolean,
      email: string
    ): Promise<ManageAdminRolesResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<ManageAdminRolesResponse>(
            "manage-system-roles-admin",
            {
              body: {
                promotion,
                email,
              },
            }
          );
        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { handlePromotion, loading };
};
