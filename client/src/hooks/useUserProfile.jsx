import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
