import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/UserProfile";
import { User } from "@supabase/supabase-js";
import CustomAvatar from "./CustomAvatar";
const ProfilePill = ({ profile }: { profile: UserProfile }) => {
  return (
    <div className="flex justify-between rounded-md mb-6 bg-white shadow-md px-2 py-2 items-center">
      <div className="pr-5">
        <CustomAvatar profile={profile} />
      </div>

      <div className="flex flex-col pl-5 pr-3 min-w-0">
        <span className="text-xs font-semibold">
          {profile.fname} {profile.lname}
        </span>
        <span className="text-xs truncate w-full text-stone-400 font-semibold">
          {profile.email}
        </span>
      </div>
    </div>
  );
};

export default ProfilePill;
