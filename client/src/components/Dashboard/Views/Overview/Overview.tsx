import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInHours,
  differenceInYears,
  format,
} from "date-fns";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/UserProfile";
import { Mail, MapPin } from "lucide-react";
import { useGetMinistry } from "@/hooks/growth/useGetMinisty";
import { useGetGifts } from "@/hooks/growth/useGetGifts";
interface OverviewProps {
  profile: UserProfile; // Replace 'any' with the actual type of profile if known
}

const Overview: React.FC<OverviewProps> = ({ profile }) => {
  const { ministries, loading: minLoading, error: minError } = useGetMinistry();
  const { gifts, loading: giftsLoading, error: giftsError } = useGetGifts();
  const formattedBirthDay = format(new Date(profile.birthday), "yyyy-MM-dd");
  const age = differenceInYears(new Date(), new Date(profile.birthday));
  let timeUnit;
  let memberSince = differenceInYears(new Date(), new Date(profile.created_at));
  timeUnit = "year";
  if (memberSince < 1) {
    memberSince = differenceInCalendarMonths(
      new Date(),
      new Date(profile.created_at)
    );
    timeUnit = "month";
    if (memberSince < 1) {
      memberSince = differenceInCalendarDays(
        new Date(),
        new Date(profile.created_at)
      );
      timeUnit = "day";
      if (memberSince < 1) {
        memberSince = differenceInHours(
          new Date(),
          new Date(profile.created_at)
        );
        timeUnit = "hour";
      }
    }
  }

  return (
    <div className="px-14 w-full grid grid-cols-2 gap-x-10">
      <Card>
        <CardHeader>
          <CardTitle>
            {profile.fname} {profile.lname}'s Profile
          </CardTitle>
          <CardDescription>Overview:</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>Your information</CardDescription>
          <ul>
            <li>Email: {profile.email}</li>
            <li>Profile: {profile.phone}</li>
            <li>Address: {profile.address}</li>
            <li>Birthday: {formattedBirthDay}</li>
            <li>Age: {age}</li>
            <li>
              Joined: {memberSince} {timeUnit}(s) ago
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="hover:bg-accent hover:text-white">
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
      {minLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        ministries &&
        ministries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ministry Score</CardTitle>
              <CardDescription>View your scores:</CardDescription>
            </CardHeader>
            <CardContent>
              {ministries.map((ministry) => (
                <ul>
                  <li key="outreach">Outreach: {ministry.outreach}</li>
                  <li key="techArts">Tech Arts: {ministry.techArts}</li>
                  <li key="worship">Worship: {ministry.worship}</li>
                  <li key="smallGroups">
                    Small Groups: {ministry.smallGroups}
                  </li>
                  <li key="youth">Children & Youth: {ministry.youth}</li>
                  <li key="followUp">Follow Ups: {ministry.followUp}</li>
                  <li key="impressions">Impressions: {ministry.impressions}</li>
                  Date Added:{" "}
                  {ministry.created_at
                    ? format(
                        new Date(ministry.created_at),
                        "yyyy-MM-dd:hh-mm a"
                      )
                    : "N/A"}
                </ul>
              ))}
            </CardContent>
          </Card>
        )
      )}
      {giftsLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        gifts &&
        gifts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Gifts Score</CardTitle>
              <CardDescription>View your scores:</CardDescription>
            </CardHeader>
            <CardContent>
              {gifts.map((gift) => (
                <ul>
                  <li key="serving">Serving: {gift.serving}</li>
                  <li key="administrator">
                    Administrator: {gift.administrator}
                  </li>
                  <li key="encouragement">
                    Encouragement: {gift.encouragement}
                  </li>
                  <li key="giving">Giving: {gift.giving}</li>
                  <li key="Mercy">Mercy: {gift.mercy}</li>
                  <li key="teaching">Teaching: {gift.teaching}</li>
                  <li key="prophecy">Prophecy: {gift.prophecy}</li>
                  Date Added:{" "}
                  {gift.created_at
                    ? format(new Date(gift.created_at), "yyyy-MM-dd ~ hh:mm a")
                    : "N/A"}
                </ul>
              ))}
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default Overview;
