import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const useOwnership = () => {
  const [ownerships, setOwnerships] = useState(null); // role_id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnership = async () => {
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
        // Fetch role from group_members
        const { data, error: ownershipError } = await supabase.functions.invoke(
          "get-group-role",
          {
            body: {
              user_id: user?.id,
            },
          }
        );
        if (ownershipError) {
          console.log(ownershipError);
          setError(ownershipError.message);
        }
        if (!data) {
          setError("No ownership data found for the user");
          setOwnerships(null);
        } else {
          const roleIds = data.roles.map((item) => item.role_id);
          setOwnerships(roleIds);
        }
      } catch (err) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnership();
  }, []);

  return { ownerships, loading, error };
};
