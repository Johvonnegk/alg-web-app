import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { UserProfile } from "../../types/UserProfile";

interface UseUpadteUserReturn {
  updateUser: (userData: {
    fname: string;
    lname: string;
    phone: string;
    address: string;
    birthday: Date;
  }) => Promise<boolean>;
  loading: boolean;
  error: string;
}

export const UseUpdateUserProfile = (): UseUpadteUserReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const updateUser = async (userData: {
    fname: string;
    lname: string;
    phone: string;
    address: string;
    birthday: Date;
  }) => {
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
      console.log("USER ERROR: ", userError, " USER: ", user);
      if (userError || !user) {
        console.log("here");
        setError(userError?.message || "No authenticated user found");
        return false;
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};
