import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Gifts } from "@/types/Gifts";
import { min } from "date-fns";

interface UseGetGiftsReturn {
  gifts: Gifts[] | null;
  fetchGifts: (authorization: string, targetId: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const useGetGifts = (
  authorization?: string,
  targetId?: string
): UseGetGiftsReturn => {
  const [gifts, setGifts] = useState<Gifts[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGifts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-user-gifts",
        { body: { authorization, targetId } }
      );
      if (error) {
        setError(error);
        return;
      } else if (!data) {
        setError("Could not get gifts data");
        return;
      }
      if (data.gifts && data.gifts.length > 0) {
        setGifts(data.gifts);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, [authorization, targetId]);

  return { gifts, fetchGifts, loading, error };
};
