import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Discipleship } from "@/types/Discipleship";

interface UseGetDiscipleshipReturn {
  discipleship: Discipleship[] | null;
  fetchDiscipleship: () => Promise<void>;
  loading: boolean;
  error: string;
}

export const useGetDiscipleship = (
  authorization?: string,
  email?: string
): UseGetDiscipleshipReturn => {
  const [discipleship, setDiscipleship] = useState<Discipleship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchDiscipleship = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-user-discipleship",
        { body: { authorization, email } }
      );

      if (error) {
        setError(error);
        return;
      } else if (!data) {
        setError("Could not get gifts data");
        return;
      }
      if (data.discipleship && data.discipleship.length > 0) {
        setDiscipleship(data.discipleship);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscipleship();
  }, [authorization, email]);

  return { discipleship, fetchDiscipleship, loading, error };
};
