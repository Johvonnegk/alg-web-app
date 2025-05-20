import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { UserAuth } from "../../context/AuthContext";
import Dashboard from "../../components/Dashbaord/Dashboard";
import Sidebar from "../../components/Sidebar/Sidebar";
const dashboard = () => {
  const { signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const { profile, loading, error } = useUserProfile();
  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <main>
        <p className="flex justify-center text-red-600">
          Could not load user data
        </p>
        <button onClick={handleSignOut}> Sign Out</button>
      </main>
    );

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr]">
      <Sidebar />
      <Dashboard />
      <button onClick={handleSignOut}> Sign Out</button>
    </main>
  );
};

export default dashboard;
