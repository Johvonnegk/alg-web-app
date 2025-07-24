import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Ministries } from "@/types/Ministries";
import { min } from "date-fns";

interface UseGetMinistryReturn {
  ministries: Ministries[] | null;
  fetchMinistry: (limit?: number) => Promise<void>;
  loading: boolean;
  error: string;
}

export const useGetMinistry = (): UseGetMinistryReturn => {
  const [ministries, setMin] = useState<Ministries[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchMinistry = async (limit?: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-user-ministry",
        {
          body: { limit: limit || 5 },
        }
      );

      if (error) {
        setError(error);
        return;
      } else if (!data) {
        setError("Could not get ministry data");
        return;
      }
      if (data.ministries && data.ministries.length > 0) {
        setMin(
          data.ministries.map((ministry: any) => ({
            id: ministry.id,
            outreach: ministry.outreach,
            techArts: ministry.tech_arts,
            worship: ministry.worship,
            smallGroups: ministry.small_groups,
            youth: ministry.children_youth,
            followUp: ministry.follow_up,
            impressions: ministry.impressions,
            created_at: ministry.created_at,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistry(5);
  }, []);

  return { ministries, fetchMinistry, loading, error };
};
