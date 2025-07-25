import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useGetUserDetails } from "@/hooks/useGetUserDetails";
import { useGetGifts } from "@/hooks/surveys/useGetGifts";
import { useGetMinistry } from "@/hooks/surveys/useGetMinisty";
import { useGetDiscipleship } from "@/hooks/surveys/useGetDiscipleship";
import { columns as giftColumns } from "@/components/Tables/SurveyTables/GiftsTable/columns";
import { columns as minColumns } from "@/components/Tables/SurveyTables/MinistriesTable/columns";
import { columns as discColumns } from "@/components/Tables/SurveyTables/DiscipleshipTable/columns";
import { DataTable } from "@/components/Tables/SurveyTables/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import Profile from "@/components/Profile/Profile";
const MemberDetail = () => {
  const { userId } = useParams();
  const {
    user,
    loading: userLoading,
    error,
  } = useGetUserDetails("group_leader", userId);
  // user = null;
  const {
    ministries,
    loading: minLoading,
    error: minError,
  } = useGetMinistry("group_leader", userId);
  const {
    gifts,
    loading: giftsLoading,
    error: giftsError,
  } = useGetGifts("group_leader", userId);
  const {
    discipleship,
    loading: discipleshipLoading,
    error: discipleshipError,
  } = useGetDiscipleship("group_leader", userId);
  return (
    <div className="px-14 min-h-screen min-w-screen grid grid-cols-2 gap-y-10 gap-x-10">
      <div className="flex flex-col items-center col-span-2">
        {userLoading ? (
          <div className="flex flex-col w-1/2 min-h-full col-span-2 space-y-3">
            <h2 className="font-semibold text-2xl">User Profile</h2>
            <Skeleton className="h-full w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col items-center w-full">
            <div className="w-1/2">
              <h2 className="font-semibold text-2xl mb-4">User Profile</h2>
              <Profile profile={user} edit={false} />
            </div>
          </div>
        ) : (
          <p>Could not load user data</p>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-full min-h-full col-span-2 space-y-3">
          <h2 className="font-semibold text-2xl">Discipleship Data</h2>
          {minLoading ? (
            <>
              <Skeleton className="h-full w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            ministries && (
              <DataTable
                columns={minColumns}
                data={ministries}
                showDate={false}
              />
            )
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-full min-h-full col-span-2 space-y-3">
          <h2 className="font-semibold text-2xl">Gifts Data</h2>
          {giftsLoading ? (
            <>
              <Skeleton className="h-full w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            gifts && (
              <DataTable columns={giftColumns} data={gifts} showDate={false} />
            )
          )}
        </div>
      </div>
      <div className="flex flex-col col-span-2 items-center">
        <div className="flex flex-col w-full min-h-full col-span-2 space-y-3 items-center">
          <h2 className="w-1/2 font-semibold text-2xl">Discipleship Data</h2>
          {discipleshipLoading ? (
            <>
              <Skeleton className="h-full w-1/2 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            discipleship && (
              <div className="w-1/2">
                <DataTable
                  columns={discColumns}
                  data={discipleship}
                  showDate={false}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
