import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useUserRole } from "../../hooks/useUserRole";
import { useAuth } from "../../context/AuthContext";
import Overview from "../../components/Dashboard/Views/Overview";
import Groups from "../../components/Dashboard/Views/Groups/Groups";
import Growth from "../../components/Dashboard/Views/Growth";
import DashboardContainer from "../../components/Dashboard/DashboardContainer";
import Sidebar from "../../components/Sidebar/Sidebar";
import { UserProfile } from "../../types/UserProfile"
const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState(() => {
    return localStorage.getItem("dashboardView") || "overview";
  });

  useEffect(() => {
    localStorage.setItem("dashboardView", view);
  }, [view]);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const { profile, loading: pLoading, error: pError } = useUserProfile();
  const { role, loading: rLoading, error: rError } = useUserRole();

  const renderView = useMemo(() => {
    if (!profile) return null;
    switch (view) {
      case "overview":
        return <Overview/>;
      case "groups":
        return <Groups role={role} />;
      case "growth":
        return <Growth/>;
      default:
        return <Overview/>;
    }
  }, [view, profile, role]);
  
  if (pLoading || rLoading) return <p>Loading...</p>;

  if (pError || !profile)
    return (
      <main>
        <p className="flex justify-center text-red-600">
          {pError ? `Could not load profile data` : `No profile data found`}
        </p>
        <button onClick={handleSignOut}>Sign Out</button>
      </main>
    );

  if (rError || !role)
    return (
      <main>
        <p className="flex justify-center text-red-600">
          {rError ? `Error user has no role` : `No user role data found`}
        </p>
        <button onClick={handleSignOut}>Sign Out</button>
      </main>
    );





  return (
    <main className="grid gap-4 p-4 grid-cols-[220px_1fr]">
      <Sidebar profile={profile} onSelect={setView} selected={view} />
      <DashboardContainer profile={profile} View={renderView} />
      <button onClick={handleSignOut}> Sign Out</button>
    </main>
  );
};

export default Dashboard;
