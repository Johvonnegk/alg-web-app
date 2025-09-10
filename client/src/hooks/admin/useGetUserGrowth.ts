import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

interface UseGetUserGrowthReturn {
  growth: any;
  loading: boolean;
  error: string;
  fetchGrowth: (
    granularity: string,
    cumulative: boolean,
    start?: Date | null,
    end?: Date | null
  ) => Promise<void>;
}

export const useGetUserGrowth = (
  granularity: string,
  cumulative: boolean,
  start?: Date | null,
  end?: Date | null
): UseGetUserGrowthReturn => {
  const [growth, setGrowth] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGrowth = async (
    granularity: string,
    cumulative: boolean,
    start?: Date | null,
    end?: Date | null
  ) => {
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

      const { data, error } = await supabase.rpc("user_growth", {
        p_granularity: granularity,
        p_cumulative: cumulative,
        p_start: start ? start.toISOString() : null,
        p_end: end ? end.toISOString() : null,
        p_tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    fetchGrowth(granularity, cumulative, start, end);
  }, [granularity, cumulative]);

  return { growth, fetchGrowth, loading, error };
};
