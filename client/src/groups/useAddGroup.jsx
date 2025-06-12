import { supabase } from "../supabaseClient";
import { useEffect, useState, useCallback } from "react";

export const useAddUserGroup = (userId, groupId, email) => {
  const [loading, setLoading] = useState(false);

  const addGroup = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: addError } = await supabase.functions.invoke(
        "add-group-members",
        {
          body: {
            user_id: userId,
            group_id: groupId,
            email: email,
          },
        }
      );
      if (addError) {
        console.error("There was an error fetching the group:", groupError);
        setError("Failed to fetch group data");
        return { success: false, error: addError };
      }
      if (!data) {
        return { success: false, error: "There is no user data" };
      }
      console.log("Group added user to group successfully");
      return { success: true };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { addGroup, loading };
};
