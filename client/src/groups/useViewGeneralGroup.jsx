import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export const useViewGeneralGroups = () => {
  const [group, setGroup] = useState([]);
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
        const result = await supabase.functions.invoke("view-general-members", {
          body: { user_id: user_id },
        });
        setGroup(result.data);
      } catch (e) {
        console.error("Supabase function error: ", e);

        try {
          const errRes = await e.response.json();
          if (errRes?.error === "User is not in a group") {
            console.error("You are not curently in a group");
            setError("You are not curently in a group");
          } else {
            setError(errRes?.error || "An unknown exception occured");
          }
        } catch (jsonErr) {
          console.error("Failed to parse error response: ", jsonErr);
          setError("Failed to fetch group data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, []);
  return { group, loading, error };
};
