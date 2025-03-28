import React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";

const providers = [
  { id: "credentials", name: "Email and Password" },
  { id: "google", name: "Google" },
  { id: "apple", name: "Apple" },
  { id: "microsoft" },
];

const login = () => {
  return (
    <AppProvider>
      <SignInPage
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          form: { noValidate: true },
        }}
        signIn={async (provider) => {
          // Your sign in logic
        }}
      />
    </AppProvider>
  );
};

export default login;
