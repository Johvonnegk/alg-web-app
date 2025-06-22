import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Invite } from "@/types/Invite";
interface UseGetGroupReturn {
  invites: Invite[] | null;
  loading: boolean;
  error: string;
}

export const useGetGroupInvitations = (): UseGetGroupReturn => {
  const [invites, setInvites] = useState<Invite[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "get-group-invites"
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

        setInvites(data.invites as Invite[]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);
  return { invites, loading, error };
};
