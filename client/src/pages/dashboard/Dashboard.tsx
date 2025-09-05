import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/profile/useUserProfile";
import { useAuth } from "../../context/AuthContext";
import Overview from "../../components/Dashboard/Views/Overview/Overview";
import Groups from "../../components/Dashboard/Views/Groups/Groups";
import Surveys from "../../components/Dashboard/Views/Surveys/Surveys";
import Growth from "../../components/Dashboard/Views/Growth/Growth";
import Admin from "../../components/Dashboard/Views/Admin/Admin";
import Dashboard404 from "../../components/Dashboard/Views/404/Dashboard404";
import DashboardContainer from "../../components/Dashboard/DashboardContainer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { UserProfile } from "../../types/UserProfile";
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
  const renderView = useMemo(() => {
    if (!profile) return null;
    switch (view) {
      case "overview":
        return <Overview profile={profile} />;
      case "groups":
        return <Groups />;
      case "surveys":
        return <Surveys />;
      case "admin":
        if (profile.role_id === 1) return <Admin />;
      case "growth":
        if (profile.role_id === 1) return <Growth />;
      default:
        return <Dashboard404 />;
    }
  }, [view, profile]);

  if (pLoading) return <p>Loading...</p>;

  if (pError || !profile)
    return (
      <main>
        <p className="flex justify-center text-red-600">
          {pError ? `Could not load profile data` : `No profile data found`}
        </p>
        <button onClick={handleSignOut}>Sign Out</button>
      </main>
    );

  return (
    <>
      <SidebarProvider>
        <AppSidebar profile={profile} onSelect={setView} selected={view} />
        <main className="w-full md:px-10">
          <DashboardContainer profile={profile} View={renderView} />
        </main>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;
