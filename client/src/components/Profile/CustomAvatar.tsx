import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/UserProfile";
import { User } from "@supabase/supabase-js";
const CustomAvatar = ({
  profile,
}: {
  profile: { fname: string; lname: string; profile_icon: string };
}) => {
  return (
    <Avatar>
      <AvatarImage src={profile.profile_icon} />
      <AvatarFallback className="bg-accent text-white">
        {profile.fname[0]}
        {profile.lname[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
