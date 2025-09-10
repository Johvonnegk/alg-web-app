import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { FunctionsHttpError } from "@supabase/supabase-js";

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
  }: UpdateInvitesParams): Promise<{ success: boolean; error?: string }> => {
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

      if (error && error instanceof FunctionsHttpError) {
        const errMessage = await error.context.json();
        setError(errMessage.error);
        return { success: false, error: errMessage.error };
      }
      if (!data) {
        const msg = error?.message || "Unknown exception occurred";
        setError(msg);
        return { success: false, error: msg };
      }
      if (!data.success) {
        const msg = "Could not find an invite to update";
        setError(msg);
        return { success: false, error: msg };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { updateInvites, loading, message, error };
};
