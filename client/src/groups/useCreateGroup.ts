import { supabase } from "../supabaseClient";
import { useState, useCallback } from "react";

interface GroupInfo {
  name: string,
  description: string,
}

interface CreategroupResponse {
  error?: string, 
  message?: string,
  success: boolean, 
}


export const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);

  const createGroup = useCallback(async (groupInfo: GroupInfo): Promise<CreategroupResponse> => {
    setLoading(true);
    try {
      const { name, description } = groupInfo;
      const { data: groupData, error: groupError } =
        await supabase.functions.invoke("create-group", {
          body: {
            name,
            description,
          },
        });

      if (groupError) {
        console.error("There was an error creating the group:", groupError);
        return { success: false, error: groupError };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { createGroup, loading };
};
