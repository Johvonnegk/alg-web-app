import React from "react";
import AccountToggle from "./AccountToggle";
import Search from "./Search";
import RouteSelect from "./RouteSelect";
const Sidebar = ({ profile, onSelect, selected }) => {
  return (
    <div>
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle profile={profile} />
        <Search />
        <RouteSelect onSelect={onSelect} selected={selected} />
      </div>
    </div>
  );
};

export default Sidebar;
