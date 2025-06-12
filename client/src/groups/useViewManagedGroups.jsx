import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export const useViewManagedGroups = () => {
  const [leaderGroup, setLeaderGroup] = useState([]);
  const [coLeaderGroup, setcoLeaderGroup] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        const user_id = user?.id;
        if (userError || !user) {
          console.error("There was an error fetching the user:", userError);
          setError(userError?.message || "No authenticated user found");
          return;
        }
        const { data: groupData, error: groupError } =
          await supabase.functions.invoke("view-managed-group", {
            body: {
              user_id: user_id,
            },
          });
        if (groupError) {
          console.error("There was an error fetching the group:", groupError);
          setError("Failed to fetch group data");
          return;
        }

        console.log("Group fetched successfully:", groupData);
        setLeaderGroup(groupData.leaderMembers);
        setcoLeaderGroup(groupData.coLeaderMembers);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, []);
  return { leaderGroup, coLeaderGroup, loading, error };
};
