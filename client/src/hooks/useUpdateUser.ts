import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { UserProfile } from "../types/UserProfile";

interface UseUpadteUserReturn {
  updateUser: (email: string) => Promise<boolean>;
  loading: boolean;
  error: string;
}

export const UseUpdateUser = (): UseUpadteUserReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const updateUser = async (email: string) => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.updateUser({ email: email });

      if (userError || !user) {
        setError(userError?.message || "No authenticated user found");
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
      return false;
    }
  };

  return { updateUser, loading, error };
};
