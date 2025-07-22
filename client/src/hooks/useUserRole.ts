import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface UseUserRoleReturn {
  role: number | null;
  loading: boolean;
  error: string;
}

export const useUserRole = (): UseUserRoleReturn => {
  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);

        // Fetch user profile from 'users' table using ID
        const { data, error: roleError } = await supabase.functions.invoke(
          "get-user-role"
        );

        if (roleError || !data) {
          setError(roleError.message);
        } else {
          setRole(data.role_id);
        }
      } catch (err) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading, error };
};
