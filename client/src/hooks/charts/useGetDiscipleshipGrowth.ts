import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

interface UseGetDiscipleshipGrowthOptions {
  granularity: string;
  authorization?: "group" | "admin" | null;
  start?: Date | null;
  end?: Date | null;
  groupId?: string | null;
  filterId?: string | null;
}

interface UseGetDiscipleshipGrowthReturn {
  discipleship: any;
  loading: boolean;
  error: string;
  fetchDiscipleshipGrowth: (
    granularity: string,
    authorization?: "group_leader" | "admin" | null,
    start?: Date | null,
    end?: Date | null,
    groupId?: string | null,
    filterId?: string | null
  ) => Promise<void>;
}

export const useGetDiscipleshipGrowth = ({
  granularity,
  authorization,
  start = null,
  end = null,
  groupId = null,
  filterId = null,
}: UseGetDiscipleshipGrowthOptions): UseGetDiscipleshipGrowthReturn => {
  const [discipleship, setDiscipleship] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchDiscipleshipGrowth = async (
    granularity: string,
    authorization?: "group" | "admin" | null,
    start: Date | null = null,
    end: Date | null = null,
    groupId: string | null = null,
    filterId: string | null = null
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
        "get-discipleship-growth",
        {
          body: {
            authorization: authorization ? authorization : null,
            start_date: start ? start.toISOString() : null,
            end_date: end ? end.toISOString() : null,
            granularity,
            filter_id: filterId,
            group_id: groupId,
          },
        }
      );

      if (error) {
        setError(error.message);
      } else {
        setDiscipleship(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscipleshipGrowth(
      granularity,
      authorization,
      start,
      end,
      groupId,
      filterId
    );
  }, [granularity, authorization, start, end, groupId, filterId]);

  return { discipleship, fetchDiscipleshipGrowth, loading, error };
};
