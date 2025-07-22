import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { UserProfile } from "@/types/UserProfile";
import { min } from "date-fns";

interface UseGetUsersReturn {
  users: UserProfile[];
  loading: boolean;
  error: string;
}

export const useGetUsers = (): UseGetUsersReturn => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const fetchUsers = async (limit?: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "view-users-admin"
      );

      if (error) {
        setError(error);
        return;
      } else if (!data) {
        setError("Could not get user data");
        console.log("error");
        return;
      }
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error };
};
