import React from "react";
import CustomAvatar from "./CustomAvatar";
import { GroupMember } from "@/types/Group";
import { roleMap, memberMap } from "@/components/Dashboard/Views/Groups/Groups";
const GroupProfilePill = ({ p }: { p: GroupMember }) => {
  const profile = p.users;
  return (
    <div className="flex justify-between rounded-md bg-white shadow-md px-2 py-2 items-center">
      <div className="pr-5 flex flex-col items-center">
        <CustomAvatar profile={profile} />
        <span className="text-xs text-stone-400 font-semibold">
          {roleMap[profile.role_id ? profile.role_id : 5]}
        </span>
      </div>

      <div className="flex flex-col pl-5 pr-3 text-xs items-center">
        <span className="font-semibold">
          {profile.fname} {profile.lname}
        </span>
        <span className=" text-stone-400 font-semibold">
          Group: {memberMap[p.role_id - 1]}
        </span>
        <span className="text-stone-400 font-semibold">{profile.email}</span>
      </div>
    </div>
  );
};

export default GroupProfilePill;
