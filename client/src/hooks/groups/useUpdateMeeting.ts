import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { MeetingFormValues } from "@/components/Dashboard/Views/Groups/Manager/MeetingManagerCreate";
interface UpdateMeetingResponse {
  success: boolean;
  error?: string;
}
function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);

  const result = new Date(date);
  result.setHours(hours);
  result.setMinutes(minutes);
  result.setSeconds(0);
  result.setMilliseconds(0);

  return result;
}
export const useUpdateMeeting = () => {
  const [loading, setLoading] = useState(false);

  const updateMeeting = useCallback(
    async (
      record: MeetingFormValues,
      meetingId: string,
      groupId: number
    ): Promise<UpdateMeetingResponse> => {
      setLoading(true);
      const fullDateTime = combineDateAndTime(record.date, record.time);
      try {
        const { data, error } =
          await supabase.functions.invoke<UpdateMeetingResponse>(
            "update-group-meeting",
            {
              body: {
                group_id: groupId,
                meeting_id: meetingId,
                date: fullDateTime,
                location: record.location,
                title: record.title,
                notes: record.notes,
                attendances: record.attendances,
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

  return { updateMeeting, loading };
};
