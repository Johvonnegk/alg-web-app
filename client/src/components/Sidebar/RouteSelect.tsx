import React from "react";
import { useState } from "react";
import { FaHome, FaLeaf } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
const RouteSelect = ({ onSelect, selected }) => {
  const routes = [
    { title: "Overview", value: "overview", Icon: FaHome },
    { title: "Groups", value: "groups", Icon: MdGroup },
    { title: "My Growth", value: "growth", Icon: FaLeaf },
  ];
  return (
    <div className="space-y-1">
      {routes.map(({ title, value, Icon }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
            selected === value
              ? "bg-white text-stone-940 shadow"
              : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
          }`}
        >
          <Icon className={selected === value ? "text-accent" : ""} />
          <span>{title}</span>
        </button>
      ))}
    </div>
  );
};

export default RouteSelect;
