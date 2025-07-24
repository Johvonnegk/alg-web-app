import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(
    async (email: string): Promise<DeleteUserResponse> => {
      setLoading(true);

      try {
        const { data, error } =
          await supabase.functions.invoke<DeleteUserResponse>(
            "delete-user-admin",
            {
              body: {
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
  return { handleDelete, loading };
};
