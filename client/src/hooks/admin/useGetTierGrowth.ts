import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

interface UseGetTierGrowthReturn {
  growth: any;
  loading: boolean;
  error: string;
  fetchGrowth: (start?: Date | null, end?: Date | null) => Promise<void>;
}

export const useGetUserGrowth = (
  start?: Date | null,
  end?: Date | null
): UseGetTierGrowthReturn => {
  const [growth, setGrowth] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGrowth = async (start?: Date | null, end?: Date | null) => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message || "No authenticated user found");
        return;
      }

      const { data, error } = await supabase.rpc("get_role_changes", {
        start_date: start
          ? start.toISOString()
          : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        filter_type: "promotion",
      });
      if (error) {
        setError(error.message);
      } else {
        setGrowth(data);
      }
    } catch (err) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowth(start, end);
  }, []);

  return { growth, fetchGrowth, loading, error };
};
