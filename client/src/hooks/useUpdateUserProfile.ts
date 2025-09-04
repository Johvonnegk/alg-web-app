import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { UserProfile } from "../types/UserProfile";

interface UseUpadteUserReturn {
  updateUser: (userData: UserProfile) => Promise<boolean>;
  loading: boolean;
  error: string;
}

export const UseUpdateUserEmail = (): UseUpadteUserReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const updateUser = async (userData: UserProfile) => {
    try {
      setLoading(true);

      const { data: user, error: userError } = await supabase.functions.invoke(
        "update-user-profile",
        {
          body: {
            fname: userData.fname,
            lname: userData.lname,
            address: userData.address,
            birthday: userData.birthday,
            phone: userData.phone,
          },
        }
      );

      if (userError || !user) {
        setError(userError?.message || "No authenticated user found");
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
      return false;
    }
  };

  return { updateUser, loading, error };
};
