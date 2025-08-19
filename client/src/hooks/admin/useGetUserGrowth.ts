import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

interface UseGetUserGrowthReturn {
  growth: any;
  loading: boolean;
  error: string;
  fetchGrowth: (granularity: string, cumulative: boolean) => Promise<void>;
}

export const useGetUserGrowth = (
  granularity: string,
  cumulative: boolean
): UseGetUserGrowthReturn => {
  const [growth, setGrowth] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGrowth = async (granularity: string, cumulative: boolean) => {
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
      const { data, error } = await supabase.rpc("get_user_growth", {
        granularity: granularity,
        cumulative: cumulative,
      });
      if (error) {
        setError(error.message);
      } else {
        console.log("PARAMS: ", cumulative, " ", granularity);
        setGrowth(data);
      }
    } catch (err) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowth(granularity, cumulative);
  }, [granularity, cumulative]);

  return { growth, fetchGrowth, loading, error };
};
