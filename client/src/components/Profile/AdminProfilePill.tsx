import React from "react";
import CustomAvatar from "./CustomAvatar";
import { UserProfile } from "@/types/UserProfile";
import { roleMap } from "@/components/Dashboard/Views/Groups/Groups";
const AdminProfilePill = ({ profile }: { profile: UserProfile }) => {
  return (
    <div className="flex justify-between rounded-md bg-white shadow-md px-2 py-2 items-center">
      <div className="pr-5 flex flex-col items-center">
        <CustomAvatar profile={profile} />
        <span className="text-xs font-semibold">
          {roleMap[profile.role_id ? profile.role_id : 5]}
        </span>
      </div>

      <div className="flex flex-col pl-5 pr-3 text-xs">
        <span className="font-semibold">
          {profile.fname} {profile.lname}
        </span>
        <span className="text-stone-400 font-semibold">{profile.email}</span>
      </div>
    </div>
  );
};

export default AdminProfilePill;
