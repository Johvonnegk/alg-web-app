import React from "react";
import { useEffect } from "react";
import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const ConfirmSuccess = () => {
  useEffect(() => {
    supabase.auth.signOut();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <MailCheck className="h-16 w-16 text-accent mb-4" />
      <h1 className="text-2xl font-semibold mb-2">
        You've confirmed your account
      </h1>
      <p className="text-stone-600 max-w-md">
        Successfully confirmed email, please{" "}
        <Link className="text-accent font-semibold" to="/login">
          login
        </Link>
      </p>
    </div>
  );
};

export default ConfirmSuccess;
