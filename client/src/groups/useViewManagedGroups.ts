import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface GroupMember {
  user_id: string;
  role_id: number;
  users: {
    fname: string;
    lname: string;
  };
  groups: {
    id: number;
    name: string;
  };
}

interface ManagedGroupData {
  leaderMembers: GroupMember[];
  coLeaderMembers: GroupMember[];
}

interface UseViewManagedGroupsReturn {
  leaderGroup: GroupMember[];
  coLeaderGroup: GroupMember[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>
}

export const useViewManagedGroups = (): UseViewManagedGroupsReturn => {
  const [leaderGroup, setLeaderGroup] = useState<GroupMember[]>([]);
  const [coLeaderGroup, setCoLeaderGroup] = useState<GroupMember[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGroup = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke<ManagedGroupData>("view-managed-group");

      if (error) {
        console.error("There was an error fetching the group:", error);
        setError("Failed to fetch group data");
        setLeaderGroup([]);
        setCoLeaderGroup([]);
        return;
      }

      if (data) {
        setLeaderGroup(data.leaderMembers || []);
        setCoLeaderGroup(data.coLeaderMembers || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      setLeaderGroup([]);
      setCoLeaderGroup([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGroup();
  }, []);

  return { leaderGroup, coLeaderGroup, loading, error, refetch: fetchGroup };
};
