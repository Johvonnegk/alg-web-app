import React from "react";
import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign In
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("There was a problem loggin in: ", error);
        return { success: false, error: error.message };
      }
      console.log("log-in succes: ", data);
      return { success: true, data };
    } catch (error) {
      console.error("[ERROR] An error occured while loggin in: ", error);
    }
  };

  // Sign Up
  const signUpNewUser = async (signupInfo) => {
    const { fname, lname, email, phone, password, address } = signupInfo;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError) {
      return { success: false, error: signUpError };
    }

    const { data: user, error: userError } = await supabase.functions.invoke(
      "create-user",
      {
        body: {
          fname: fname,
          lname: lname,
          email: email,
          phone: phone,
          address: address,
          user_id: signUpData.user.id,
        },
      }
    );

    if (userError) {
      console.error("There was an error creating the user:", userError);
      return { success: false, error: userError };
    }

    const { data: roleResult, error: roleError } =
      await supabase.functions.invoke("create-user-role", {
        body: {
          user_id: signUpData.user.id,
        },
      });

    if (roleError) {
      console.log("roleResult: ", signUpData.user.id);
      console.error("There was an error assigning the user role:", roleError);
      return { success: false, error: roleError };
    }

    return { success: true, data: user };
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign Out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("There was an error: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, signInUser, signUpNewUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
