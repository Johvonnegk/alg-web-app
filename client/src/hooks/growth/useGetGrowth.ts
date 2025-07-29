import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Growth } from "@/types/Growth";
import { min } from "date-fns";

interface UseGetGrowthReturn {
  growth: Growth[] | null;
  fetchGrowth: (authorization: string, targetId: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const useGetGrowth = (
  authorization?: string,
  targetId?: string
): UseGetGrowthReturn => {
  const [growth, setGrowth] = useState<Growth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGrowth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-user-growth",
        { body: { authorization, targetId } }
      );
      if (error) {
        setError(error);
        return;
      } else if (!data) {
        setError("Could not get growth data");
        return;
      }
      if (data.growth && data.growth.length > 0) {
        setGrowth(data.growth);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowth();
  }, [authorization, targetId]);

  return { growth, fetchGrowth, loading, error };
};
