import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useUserRole } from "../../hooks/useUserRole";
import { useAuth } from "../../context/AuthContext";
import Overview from "../../components/Dashboard/Views/Overview";
import Groups from "../../components/Dashboard/Views/Groups/Groups";
import Growth from "../../components/Dashboard/Views/Growth";
import Dashboard from "../../components/Dashboard/Dashboard";
import Sidebar from "../../components/Sidebar/Sidebar";
const dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("overview");

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const { profile, profileLoading, profileError } = useUserProfile();
  const { role, roleLoading, roleError } = useUserRole();
  if (profileLoading || roleLoading) return <p>Loading...</p>;
  if (profileError) {
    return (
      <main>
        <p className="flex justify-center text-red-600">
          Could not load profile data
        </p>
        <button onClick={handleSignOut}> Sign Out</button>
      </main>
    );
  } else if (!profile) {
    return (
      <main>
        <p className="flex justify-center text-red-600">
          No profile data found
        </p>
        <button onClick={handleSignOut}> Sign Out</button>
      </main>
    );
  }
  if (roleError)
    return (
      <main>
        <p className="flex justify-center text-red-600">
          Error user has no role
        </p>
        <button onClick={handleSignOut}> Sign Out</button>
      </main>
    );
  if (!role) {
    return (
      <main>
        <p className="flex justify-center text-red-600">
          No user role data found
        </p>
        <button onClick={handleSignOut}> Sign Out</button>
      </main>
    );
  }

  const renderView = () => {
    switch (view) {
      case "overview":
        return <Overview profile={profile} />;
      case "groups":
        return <Groups profile={profile} role={role} />;
      case "growth":
        return <Growth profile={profile} />;
      default:
        return <Overview profile={profile} />;
    }
  };

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr]">
      <Sidebar profile={profile} onSelect={setView} selected={view} />
      <Dashboard profile={profile} View={renderView()} />
      <button onClick={handleSignOut}> Sign Out</button>
    </main>
  );
};

export default dashboard;
