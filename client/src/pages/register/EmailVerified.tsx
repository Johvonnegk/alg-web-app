// src/pages/EmailVerified.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const EmailVerified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        // Successful confirmation — redirect to dashboard
        navigate("/dashboard");
      } else {
        console.error("Email not confirmed:", error);
        // Optionally show a retry or error message
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold">Verifying email...</h2>
    </div>
  );
};

export default EmailVerified;
