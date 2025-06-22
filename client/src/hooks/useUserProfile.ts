import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { UserProfile } from "../types/UserProfile";

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Get current auth user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError(userError?.message || "No authenticated user found");
          return;
        }

        // Fetch user profile from 'users' table using ID
        const { data, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
