import React from "react";
import { useState } from "react";
import TopBar from "./TopBar";
import Overview from "./Views/Overview/Overview";
import Groups from "./Views/Groups/Groups";
import Growth from "./Views/Surveys/Surveys";
import { UserProfile } from "@/types/UserProfile";
interface DashboardContainerProps {
  profile: UserProfile;
  View: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  profile,
  View,
}) => {
  return (
    <div className="w-full pt-21 bg-white rounded-lg pb-4 shadow h-fit">
      <TopBar name={profile.fname} />
      {View}
    </div>
  );
};

export default DashboardContainer;
