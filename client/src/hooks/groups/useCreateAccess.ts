import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

interface UseCreateReturn {
  allowed: boolean;
  loading: boolean;
  error: string;
}

export const useCreateAccess = (): UseCreateReturn => {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "create-group-access"
        );
        if (!data || error) {
          setError("An error occured while fetching role");
          setAllowed(false);
        } else {
          setAllowed(data.allowed ?? false);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAccess();
  }, []);

  return { allowed, loading, error };
};
