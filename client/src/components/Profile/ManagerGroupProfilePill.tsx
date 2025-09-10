import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupMember } from "@/types/Group";
import { roleMap, memberMap } from "@/components/Dashboard/Views/Groups/Groups";
import { Link } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import CustomAvatar from "./CustomAvatar";
const ManagerGroupProfilePill = ({ p }: { p: GroupMember }) => {
  const profile = p.users;
  return (
    <div className="flex justify-between rounded-md bg-white shadow-md px-2 py-2 items-center">
      <div className="pr-5 flex flex-col items-center">
        <CustomAvatar profile={profile} />
        <span className="text-xs text-stone-400 font-semibold">
          {roleMap[profile.role_id ? profile.role_id : 5]}
        </span>
      </div>

      <div className="flex flex-col pl-5 pr-3 text-xs">
        <span className="font-semibold">
          {profile.fname} {profile.lname}
        </span>
        <span className=" text-stone-400 font-semibold">
          Group: {memberMap[p.role_id - 1]}
        </span>
        <span className="text-stone-400 font-semibold">{profile.email}</span>
      </div>
      <div className="px-2">
        <Link
          className="underline text-accent hover:text-black"
          to={`/member-details/${profile.user_id}`}
        >
          <HiDotsHorizontal className="text-accent size-7" />
        </Link>
      </div>
    </div>
  );
};

export default ManagerGroupProfilePill;
