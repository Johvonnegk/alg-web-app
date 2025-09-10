import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { GroupMember } from "@/types/Group";

interface SupabaseFunctionResult {
  data: GroupMember[] | { message: string } | null;
  error: { message: string } | null;
}

interface UseViewGeneralGroupsReturn {
  group: GroupMember[] | null;
  loading: boolean;
  error: string;
}

export const useViewGeneralGroups = (): UseViewGeneralGroupsReturn => {
  const [group, setGroup] = useState<GroupMember[] | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const result = (await supabase.functions.invoke(
          "view-general-members"
        )) as SupabaseFunctionResult;
        console.log("RESULT: ", result);
        if (result.error) {
          setError(result.error.message || "Unknown error occurred");
          setGroup(null);
          return;
        }

        // Handle known message responses like "No user found"
        if (
          result.data &&
          !Array.isArray(result.data) &&
          "message" in result.data
        ) {
          setGroup(null);
          return;
        }

        if (Array.isArray(result.data)) {
          setGroup(result.data);
        } else {
          setGroup(null);
        }
      } catch (e: any) {
        console.error("Supabase function error:", e);

        try {
          const errRes = await e.response?.json?.();
          setError(
            errRes?.error === "User is not in a group"
              ? "You are not currently in a group"
              : errRes?.error || "An unknown exception occurred"
          );
        } catch {
          setError("Failed to fetch group data");
        }
        setGroup(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, []);

  return { group, loading, error };
};
