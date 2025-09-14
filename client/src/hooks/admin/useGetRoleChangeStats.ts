import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

interface UseGetRoleChangeStatsOptions {
  granularity: string;
  start?: Date | null;
  end?: Date | null;
}

interface UseGetRoleChangeStatsReturn {
  stats: any;
  loading: boolean;
  error: string;
  fetchRoleChangeStats: (
    granularity: string,
    start?: Date | null,
    end?: Date | null
  ) => Promise<void>;
}

export const UseGetRoleChangeStats = ({
  granularity,
  start = null,
  end = null,
}: UseGetRoleChangeStatsOptions): UseGetRoleChangeStatsReturn => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchRoleChangeStats = async (
    granularity: string,
    start: Date | null = null,
    end: Date | null = null
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

      const { data, error } = await supabase.functions.invoke(
        "get-role-change-stats",
        {
          body: {
            start_date: start ? start.toISOString() : null,
            end_date: end ? end.toISOString() : null,
            granularity,
          },
        }
      );

      if (error) {
        setError(error.message);
      } else {
        const pivoted = (data.data || []).reduce((acc: any[], row: any) => {
          let entry = acc.find((e) => e.period === row.period);
          if (!entry) {
            entry = { period: row.period };
            acc.push(entry);
          }
          entry[`role${row.role}_promotions`] = Number(row.promotions);
          entry[`role${row.role}_demotions`] = Number(row.demotions);
          return acc;
        }, []);
        setStats(pivoted);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleChangeStats(granularity, start, end);
  }, [granularity, start, end]);

  return { stats, fetchRoleChangeStats, loading, error };
};
