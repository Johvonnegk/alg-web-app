import React from "react";

import { MailCheck } from "lucide-react";

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <MailCheck className="h-16 w-16 text-accent mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
      <p className="text-stone-600 max-w-md">
        We’ve sent a confirmation link to your email. Please check your inbox
        and click the link to verify your account.
      </p>
    </div>
  );
};

export default EmailConfirmation;
