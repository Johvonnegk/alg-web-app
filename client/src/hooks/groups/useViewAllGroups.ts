import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Groups } from "@/types/Group";
interface useViewAllGroupsReturn {
  groups: Groups[];
  loading: boolean;
  error?: string;
}

export const useViewAllGroups = (): useViewAllGroupsReturn => {
  const [groups, setGroups] = useState<Groups[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const { data, error } =
          await supabase.functions.invoke("view-all-groups");
        if (!data || error) {
          setGroups([]);
          setError(error?.message);
        } else {
          setGroups(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return { groups, loading, error };
};
