import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

interface UseGetRoleChangeStatsOptions {
  start?: Date | null;
  end?: Date | null;
}

interface UseGetRoleChangeStatsReturn {
  stats: any;
  loading: boolean;
  error: string;
  fetchRoleChangeStats: (
    start?: Date | null,
    end?: Date | null
  ) => Promise<void>;
}

function getLastMonthsDate() {
  const now = new Date(); // Get the current date and time
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 30
  ); // Create a new Date object by subtracting 7 days
  return lastMonth;
}

export const UseGetRoleChangeStats = ({
  start = null,
  end = null,
}: UseGetRoleChangeStatsOptions): UseGetRoleChangeStatsReturn => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchRoleChangeStats = async (
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
      const prevDate = getLastMonthsDate();
      const { data, error } = await supabase.functions.invoke(
        "get-role-change-stats",
        {
          body: {
            start_date: start ? start.toISOString() : prevDate.toISOString(),
            end_date: end ? end.toISOString() : new Date().toISOString(),
          },
        }
      );
      if (error) {
        setError(error.message);
      } else {
        setStats(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleChangeStats(start, end);
  }, [start, end]);

  return { stats, fetchRoleChangeStats, loading, error };
};
