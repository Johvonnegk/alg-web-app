import { supabase } from "@/supabaseClient";
import { useState, useCallback } from "react";
import { Meeting } from "@/types/Meeting";
import { useEffect } from "react";
interface GetMeetingsResponse {
  meetings: Meeting[];
  loading: boolean;
  error?: string;
}

export const useGetMeetings = (
  groupId: number,
  authorization: string
): GetMeetingsResponse => {
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke(
          "get-group-meetings",
          {
            body: {
              authorization: authorization,
              group_id: groupId,
            },
          }
        );
        if (!data || error) {
          setMeetings([]);
          setError(error?.message);
        } else {
          console.log("Data: ", data);
          setMeetings(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return { meetings, loading, error };
};
