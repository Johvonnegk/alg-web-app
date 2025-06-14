import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
export const useGetGroupInvitations = () => {
  const { userId } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);

        if (!userId) return;

        const { data, error } = await supabase.functions.invoke(
          "get-group-invites",
          {
            body: {
              user_id: userId,
            },
          }
        );
        if (error) {
          setInvites(null);
          setError("Error retrieving group invites");
          return;
        }
        if (!data) {
          setInvites(null);
          return;
        }
        const invites = data.invites;
        setInvites(invites);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [userId]);
  return { invites, loading, error };
};
