import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { MeetingFormValues } from "@/components/Dashboard/Views/Groups/Manager/MeetingManagerCreate";
interface DeleteMeetingResponse {
  success: boolean;
  error?: string;
}
export const useDeleteMeeting = () => {
  const [loading, setLoading] = useState(false);

  const deleteMeeting = useCallback(
    async (
      meetingId: string,
      groupId: number
    ): Promise<DeleteMeetingResponse> => {
      setLoading(true);
      try {
        const { data, error } =
          await supabase.functions.invoke<DeleteMeetingResponse>(
            "delete-group-meeting",
            {
              body: {
                meeting_id: meetingId,
                group_id: groupId,
              },
            }
          );

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: data?.success ?? true };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { deleteMeeting, loading };
};
