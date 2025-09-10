import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";

interface GroupInfo {
  name: string;
  description: string;
  id: number;
}

interface UpdateGroupResponse {
  error?: string;
  message?: string;
  success: boolean;
}

export const useUpdateGroup = () => {
  const [loading, setLoading] = useState(false);

  const updateGroup = useCallback(
    async (groupInfo: GroupInfo): Promise<UpdateGroupResponse> => {
      setLoading(true);
      try {
        const { name, description, id } = groupInfo;
        console.log(id);
        const { data: _groupData, error: groupError } =
          await supabase.functions.invoke("update-group", {
            body: {
              name,
              description,
              gId: id,
            },
          });

        if (groupError) {
          console.error("There was an error updating the group:", groupError);
          return { success: false, error: groupError };
        }

        return { success: true };
      } catch (err) {
        console.error("Unexpected error:", err);
        return { success: false, error: `${err}` };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateGroup, loading };
};
