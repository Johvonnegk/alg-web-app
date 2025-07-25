import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { UserProfile } from "@/types/UserProfile";

interface UseGetUserDetailsReturn {
  user: UserProfile | null;
  fetchUser: (authorization: string, targetId: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const useGetUserDetails = (
  authorization?: string,
  targetId?: string
): UseGetUserDetailsReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-user-data", {
        body: { authorization, targetId },
      });
      if (error) {
        setError(error);
        return;
      } else if (!data) {
        setError("Could not get user details");
        return;
      }
      if (data.user) {
        setUser(data.user);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authorization, targetId]);

  return { user, fetchUser, loading, error };
};
