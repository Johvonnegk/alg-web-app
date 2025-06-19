import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Role {
  role_id: number;
}

interface OwnershipData {
  roles: Role[];
}

interface UseOwnershipReturn {
  ownerships: number[] | null;
  loading: boolean;
  error: string;
}

export const useOwnership = (): UseOwnershipReturn => {
  const [ownerships, setOwnerships] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnership = async () => {
      try {
        setLoading(true);

        const { data, error: ownershipError } = await supabase.functions.invoke<OwnershipData>(
          "get-group-role"
        );

        if (ownershipError) {
          console.error(ownershipError);
          setError(ownershipError.message);
          setOwnerships(null);
        } else if (!data) {
          setError("No ownership data found for the user");
          setOwnerships(null);
        } else {
          const roleIds = data.roles.map((item) => item.role_id);
          setOwnerships(roleIds);
          setError("");
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error occurred");
        setOwnerships(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnership();
  }, []);

  return { ownerships, loading, error };
};
