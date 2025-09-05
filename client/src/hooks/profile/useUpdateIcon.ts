import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { UserProfile } from "../../types/UserProfile";

interface UseUpadteIconReturn {
  updateIcon: (
    url: string | undefined,
    icon: File | undefined
  ) => Promise<boolean>;
}

export const UseUpdateIcon = (): UseUpadteIconReturn => {
  const updateIcon = async (
    url: string | undefined,
    icon: File | undefined
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", icon);
      formData.append("url", url);
      const {
        data: { user },
        error: userError,
      } = await supabase.functions.invoke("update-user-icon", {
        body: formData,
      });
      if (userError || !user) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  return { updateIcon };
};
