import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/UserProfile";
import { User } from "@supabase/supabase-js";
import CustomAvatar from "./CustomAvatar";
const MeetingProfilePill = ({
  profile,
  attendance,
}: {
  profile: UserProfile;
  attendance: string;
}) => {
  return (
    <div className="flex rounded-md mb-6 bg-white shadow-md px-2 py-2 items-center">
      <div className="pr-5">
        <CustomAvatar profile={profile} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold">
          {profile.fname} {profile.lname}
        </span>
        <span className="text-xs truncate w-full text-stone-400 font-semibold">
          {profile.email}
        </span>
        <span>{attendance.charAt(0).toUpperCase() + attendance.slice(1)}</span>
      </div>
    </div>
  );
};

export default MeetingProfilePill;
