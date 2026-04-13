import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { GrowthGroups } from "@/types/Growth";

interface UseGetAllGrowthReturn {
  growth: GrowthGroups[] | null;
  loading: boolean;
  error: string;
}

export const useGetAllGrowth = (
  authorization?: string,
): UseGetAllGrowthReturn => {
  const [growth, setGrowth] = useState<GrowthGroups[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGrowth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-all-growth",
        { body: { authorization } },
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
  }, [authorization]);

  return { growth, loading, error };
};
