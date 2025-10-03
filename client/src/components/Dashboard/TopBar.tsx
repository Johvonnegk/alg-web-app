import React from "react";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { SidebarTrigger } from "../ui/sidebar";
const TopBar = ({ name }) => {
  const welcomeMsg = () => {
    const hours: number = new Date().getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  return (
    <div className="border-b px-4 pt-3 mb-4 mt-2 pb-5 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div className="flex items-center justify-between gap-2">
          <SidebarTrigger />
          <div>
            <span className="text-sm font-bold block">
              {name ? `${welcomeMsg()}, ${name}!` : "Error Loading Data"}
            </span>
            <span className="text-xs block text-stone-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        {/* <button className="flex rounded-lg text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-accent hover:text-white px-3 py-1.5">
          <FaBell />
        </button> */}
      </div>
    </div>
  );
};

export default TopBar;
