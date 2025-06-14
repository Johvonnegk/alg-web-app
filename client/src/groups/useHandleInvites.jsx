import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export const useHandleInvites = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const updateInvites = async ({ accepted, inviteId }) => {
    try {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.functions.invoke(
        "update-group-invites",
        {
          body: {
            accepted: accepted,
            invite_id: inviteId,
          },
        }
      );
      if (!data || error) {
        setError(result.error?.message || "Unkown exception occured");
        return false;
      }

      return true;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateInvites, loading, error };
};
