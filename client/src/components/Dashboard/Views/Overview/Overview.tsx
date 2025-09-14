import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { columns as giftColumns } from "@/components/Tables/SurveyTables/GiftsTable/columns";
import { columns as minColumns } from "@/components/Tables/SurveyTables/MinistriesTable/columns";
import { columns as discColumns } from "@/components/Tables/SurveyTables/DiscipleshipTable/columns";
import Profile from "@/components/Profile/Profile";
import { DataTable } from "@/components/Tables/SurveyTables/data-table";
import GrowthTable from "@/components/Tables/GrowthTracksTables/GrowthTable";
import { UserProfile } from "@/types/UserProfile";
import { useGetMinistry } from "@/hooks/surveys/useGetMinisty";
import { useGetGifts } from "@/hooks/surveys/useGetGifts";
import { useGetDiscipleship } from "@/hooks/surveys/useGetDiscipleship";
import { useGetGrowth } from "@/hooks/growth/useGetGrowth";

interface OverviewProps {
  profile: UserProfile; // Replace 'any' with the actual type of profile if known
}

const Overview: React.FC<OverviewProps> = ({ profile }) => {
  const { ministries, loading: minLoading, error: minError } = useGetMinistry();
  const { gifts, loading: giftsLoading, error: giftsError } = useGetGifts();
  const { growth, loading: growthLoading, error: growthError } = useGetGrowth();
  const {
    discipleship,
    loading: discipleshipLoading,
    error: discipleshipError,
  } = useGetDiscipleship();
  return (
    <div className="w-full flex flex-col gap-y-10 px-4 2xl:px-14 2xl:grid 2xl:grid-cols-2 2xl:gap-y-10 2xl:gap-x-10">
      <div className="col-span-2 flex justify-center">
        <div className="w-full 2xl:w-1/2">
          <Profile profile={profile} edit={true} />
        </div>
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
          <div className="flex justify-center">
            <div className="w-full">
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
      {growthLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        growth &&
        growth.length > 0 && (
          <div>
            <h2 className="font-semibold text-2xl mb-4">Growth Tracks</h2>
            <GrowthTable data={growth} />
          </div>
        )
      )}
    </div>
  );
};

export default Overview;
