import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  differenceInDays,
  differenceInMonths,
  differenceInHours,
  differenceInYears,
  format,
} from "date-fns";
import { UserProfile } from "@/types/UserProfile";
import { Button } from "@/components/ui/button";

interface ProfileProps {
  profile: UserProfile;
  edit: boolean;
}

const Profile: React.FC<ProfileProps> = ({ profile, edit }) => {
  const formattedBirthDay = format(new Date(profile.birthday), "yyyy-MM-dd");
  const age = differenceInYears(new Date(), new Date(profile.birthday));
  const now = new Date();
  const createdAt = new Date(profile.created_at);
  let timeUnit;
  let memberSince = differenceInYears(new Date(), new Date(profile.created_at));
  timeUnit = "year";
  if ((memberSince = differenceInYears(now, createdAt)) >= 1) {
    timeUnit = memberSince === 1 ? "year" : "years";
  } else if ((memberSince = differenceInMonths(now, createdAt)) >= 1) {
    timeUnit = memberSince === 1 ? "month" : "months";
  } else if ((memberSince = differenceInDays(now, createdAt)) >= 1) {
    timeUnit = memberSince === 1 ? "day" : "days";
  } else {
    memberSince = differenceInHours(now, createdAt);
    timeUnit = memberSince === 1 ? "hour" : "hours";
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {profile.fname} {profile.lname}'s Profile
        </CardTitle>
        <CardDescription>Overview:</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>User information</CardDescription>
        <ul>
          <li key="email">Email: {profile.email}</li>
          <li key="phone">Profile: {profile.phone}</li>
          <li key="address">Address: {profile.address}</li>
          <li key="birthday">Birthday: {formattedBirthDay}</li>
          <li key="age">Age: {age}</li>
          <li key="join date">
            Joined: {memberSince} {timeUnit} ago
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        {edit && (
          <Button className="hover:bg-accent hover:text-white">
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Profile;
