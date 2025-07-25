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
  differenceInDays,
  differenceInMonths,
  differenceInHours,
  differenceInYears,
  format,
} from "date-fns";
import { columns as giftColumns } from "./Tables/GiftsTable/columns";
import { columns as minColumns } from "./Tables/MinistriesTable/columns";
import { columns as discColumns } from "./Tables/DiscipleshipTable/columns";
import { DataTable } from "./Tables/data-table";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/UserProfile";
import { useGetMinistry } from "@/hooks/surveys/useGetMinisty";
import { useGetGifts } from "@/hooks/surveys/useGetGifts";
import { useGetDiscipleship } from "@/hooks/surveys/useGetDiscipleship";
interface OverviewProps {
  profile: UserProfile; // Replace 'any' with the actual type of profile if known
}

const Overview: React.FC<OverviewProps> = ({ profile }) => {
  const { ministries, loading: minLoading, error: minError } = useGetMinistry();
  const { gifts, loading: giftsLoading, error: giftsError } = useGetGifts();
  const {
    discipleship,
    loading: discipleshipLoading,
    error: discipleshipError,
  } = useGetDiscipleship();
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
  console.log("Discipleship: ", discipleship);
  return (
    <div className="px-14 w-full grid grid-cols-2 gap-y-10 gap-x-10">
      <div className="col-span-2 flex justify-center">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>
              {profile.fname} {profile.lname}'s Profile
            </CardTitle>
            <CardDescription>Overview:</CardDescription>
          </CardHeader>
          <CardContent>
            <CardDescription>Your information</CardDescription>
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
            <Button className="hover:bg-accent hover:text-white">
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
      </div>

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
          <div>
            <h2 className="font-semibold text-2xl">Ministries Data</h2>
            <DataTable
              columns={minColumns}
              data={ministries}
              showDate={false}
            />
          </div>
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
          <div>
            <h2 className="font-semibold text-2xl">Gifts Data</h2>
            <DataTable columns={giftColumns} data={gifts} showDate={false} />
          </div>
        )
      )}
      {discipleshipLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        discipleship &&
        discipleship.length > 0 && (
          <div className="col-span-2  flex justify-center">
            <div className="w-1/2">
              <h2 className="font-semibold text-2xl">Discipleship Data</h2>
              <DataTable
                columns={discColumns}
                data={discipleship}
                showDate={true}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Overview;
