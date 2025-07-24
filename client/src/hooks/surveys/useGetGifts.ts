import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Gifts } from "@/types/Gifts";
import { min } from "date-fns";

interface UseGetGiftsReturn {
  gifts: Gifts[] | null;
  fetchGifts: (limit?: number) => Promise<void>;
  loading: boolean;
  error: string;
}

export const useGetGifts = (): UseGetGiftsReturn => {
  const [gifts, setGifts] = useState<Gifts[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchGifts = async (limit?: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-user-gifts",
        {
          body: { limit: limit || 5 },
        }
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
    fetchGifts(5);
  }, []);

  return { gifts, fetchGifts, loading, error };
};
