import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { MeetingFormValues } from "@/components/Dashboard/Views/Groups/Manager/MeetingManagerCreate";
interface RecordMeetingResponse {
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
export const useRecordMeeting = () => {
  const [loading, setLoading] = useState(false);

  const recordMeeting = useCallback(
    async (
      record: MeetingFormValues,
      groupId: number
    ): Promise<RecordMeetingResponse> => {
      setLoading(true);
      const fullDateTime = combineDateAndTime(record.date, record.time);
      try {
        const { data, error } =
          await supabase.functions.invoke<RecordMeetingResponse>(
            "record-group-meeting",
            {
              body: {
                group_id: groupId,
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

  return { recordMeeting, loading };
};
