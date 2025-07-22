import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "../supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Define the shape of your context value
interface AuthContextType {
  session: Session | null | undefined;
  userId: string | null;
  email: string | null;

  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; data?: any } | void>;

  signUpNewUser: (signupInfo: {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    birthday: Date;
  }) => Promise<{ success: boolean; error?: any; data?: any }>;

  signOut: () => void;

  recoverPassword: (email: string) => Promise<Boolean>;

  updatePassword: (email: string) => Promise<Boolean>;
}

// Create the context with initial undefined, and we will check it in the hook
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("There was a problem logging in: ", error);
        return { success: false, error: error.message };
      }

      const userId = data.user?.id;
      if (userId) {
        await supabase.functions.invoke("user-confirmation", {
          body: {
            id: userId,
          },
        });
      }

      return { success: true, data };
    } catch (error) {
      console.error("[ERROR] An error occurred while logging in: ", error);
      return { success: false, error: `${error}` };
    }
  };

  const signUpNewUser = async (signupInfo: {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    birthday: Date;
  }) => {
    const { fname, lname, email, phone, password, address, birthday } =
      signupInfo;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          emailRedirectTo: `http://https://${
            import.meta.env.VITE_SITE_URL
          }/email-verified`,
        },
      }
    );
    if (signUpError) {
      return { success: false, error: signUpError };
    }

    const { data: user, error: userError } = await supabase.functions.invoke(
      "create-user",
      {
        body: {
          fname,
          lname,
          email,
          phone,
          address,
          birthday: format(birthday, "yyyy-MM-dd"),
          user_id: signUpData.user?.id,
        },
      }
    );

    if (userError) {
      console.error("There was an error creating the user:", userError);
      return { success: false, error: userError };
    } else if (!user?.success && user.error === "user_already_exists") {
      return { success: false, error: "user_already_exists" };
    }

    return { success: true, data: user };
  };

  const recoverPassword = async (email: string) => {
    console.log("recover password");
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://https://${
        import.meta.env.VITE_SITE_URL
      }/recover-password`,
    });
    if (error) {
      return false;
    } else {
      return true;
    }
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = () => {
    supabase.auth.signOut().catch((error) => {
      toast.error("There was an error signing out: ", error);
    });
    toast.success("Successfully signed out");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signInUser,
        signUpNewUser,
        signOut,
        recoverPassword,
        updatePassword,
        email: session?.user?.email ?? null,
        userId: session?.user?.id ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
