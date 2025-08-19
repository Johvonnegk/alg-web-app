import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { GrowthGroups } from "@/types/Growth";
import { min } from "date-fns";

interface UseGetUsersGrowthReturn {
  growth: GrowthGroups[] | null;
  fetchGrowth: (authorization: string, targetId: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const useGetUsersGrowth = (
  authorization?: string,
  groupId?: string | undefined
): UseGetUsersGrowthReturn => {
  const [growth, setGrowth] = useState<GrowthGroups[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGrowth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-users-growth",
        { body: { authorization, groupId } }
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
  }, [authorization, groupId]);

  return { growth, fetchGrowth, loading, error };
};
