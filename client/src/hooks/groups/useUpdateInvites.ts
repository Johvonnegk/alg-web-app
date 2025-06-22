import { useState } from "react";
import { supabase } from "@/supabaseClient";

interface UpdateInvitesParams {
  accepted: boolean;
  inviteId: number;
}

interface UpdateInvitesResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const useUpdateInvites = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const updateInvites = async ({
    accepted,
    inviteId,
  }: UpdateInvitesParams): Promise<boolean> => {
    try {
      setLoading(true);
      setError("");
      const { data, error } =
        await supabase.functions.invoke<UpdateInvitesResponse>(
          "update-group-invites",
          {
            body: {
              accepted,
              invite_id: inviteId,
            },
          }
        );
      if (error || !data) {
        setError(error?.message || "Unknown exception occurred");
        return false;
      }
      if (!data.success) {
        setError("Could not find an invite to update");
        return false;
      }
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateInvites, loading, message, error };
};
