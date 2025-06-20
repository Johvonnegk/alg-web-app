import React from "react";
import { useState } from "react";
import TopBar from "./TopBar";
import Overview from "./Views/Overview";
import Groups from "./Views/Groups/Groups";
import Growth from "./Views/Growth";
const DashboardContainer = ({ profile, View }) => {
  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[200vh]">
      <TopBar name={profile.fname} />
      {View}
    </div>
  );
};

export default DashboardContainer;
