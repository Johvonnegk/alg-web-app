import { supabase } from "../supabaseClient";
import { useState, useCallback } from "react";

export const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);

  const createGroup = useCallback(async (groupInfo) => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("There was an error fetching the user:", userError);
        return { success: false, error: userError || "User not found" };
      }

      const { name, description } = groupInfo;
      const { data: groupData, error: groupError } =
        await supabase.functions.invoke("create-group", {
          body: {
            owner_id: user.id,
            name,
            description,
          },
        });

      if (groupError) {
        console.error("There was an error creating the group:", groupError);
        return { success: false, error: groupError };
      }

      return { success: true, data: groupData };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { createGroup, loading };
};
