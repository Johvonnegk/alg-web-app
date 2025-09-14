import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserDetails } from "@/hooks/profile/useGetUserDetails";
import { useGetGifts } from "@/hooks/surveys/useGetGifts";
import { useGetMinistry } from "@/hooks/surveys/useGetMinistry";
import { useGetDiscipleship } from "@/hooks/surveys/useGetDiscipleship";
import { columns as giftColumns } from "@/components/Tables/SurveyTables/GiftsTable/columns";
import { columns as minColumns } from "@/components/Tables/SurveyTables/MinistriesTable/columns";
import { columns as discColumns } from "@/components/Tables/SurveyTables/DiscipleshipTable/columns";
import { useGetGrowth } from "@/hooks/growth/useGetGrowth";
import GiftsOverTime from "@/components/Charts/GiftsOverTime";
import MinistryOverTime from "@/components/Charts/MinistryOverTime";
import { useGetGiftsGrowth } from "@/hooks/charts/useGetGiftsGrowth";
import { DiscipleshipOneUserChart } from "@/components/Charts/DiscipleshipOverTimeOneUser";
import { useGetDiscipleshipGrowth } from "@/hooks/charts/useGetDiscipleshipGrowth";
import { useGetMinistryGrowth } from "@/hooks/charts/useGetMinistryGrowth";
import DateRangePicker, {
  DateRange,
} from "@/components/DateRangePicker/DateRangePicker";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/Tables/SurveyTables/data-table";
import GrowthTable from "@/components/Tables/GrowthTracksTables/GrowthTable";
import { Skeleton } from "@/components/ui/skeleton";
import Profile from "@/components/Profile/Profile";

const GRANULARITIES = ["day", "week", "month", "quarter", "year"] as const;
const MemberDetail = () => {
  const [gGranularity, setGGranularity] = useState("month");
  const [gRange, setGRange] = React.useState<DateRange | undefined>();
  const [mGranularity, setMGranularity] = useState("month");
  const [mRange, setMRange] = React.useState<DateRange | undefined>();
  const [dGranularity, setDGranularity] = useState("month");
  const [dRange, setDRange] = React.useState<DateRange | undefined>();
  const { userId } = useParams();
  const {
    user,
    loading: userLoading,
    error,
  } = useGetUserDetails("group_leader", userId);
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
  const {
    growth,
    loading: growthLoading,
    error: growthError,
  } = useGetGrowth("group_leader", userId);

  const {
    gifts: giftsGrowth,
    fetchGiftsGrowth,
    loading: gGLoading,
    error: gGError,
  } = useGetGiftsGrowth({
    authorization: "group_leader",
    granularity: gGranularity,
    filterId: userId,
  });
  const gEndExclusive = gRange?.to
    ? new Date(
        gRange.to.getFullYear(),
        gRange.to.getMonth(),
        gRange.to.getDate() + 1
      )
    : null;
  const applyGiftsGrowth = () => {
    fetchGiftsGrowth(gGranularity, null, gRange?.from ?? null, gEndExclusive);
  };
  const {
    ministries: ministryGrowth,
    fetchMinistryGrowth,
    loading: mGLoading,
    error: mGError,
  } = useGetMinistryGrowth({
    authorization: "group_leader",
    granularity: mGranularity,
    filterId: userId,
  });
  const mEndExclusive = mRange?.to
    ? new Date(
        mRange.to.getFullYear(),
        mRange.to.getMonth(),
        mRange.to.getDate() + 1
      )
    : null;
  const applyMinistryGrowth = () => {
    fetchMinistryGrowth(
      mGranularity,
      null,
      mRange?.from ?? null,
      mEndExclusive
    );
  };
  const {
    discipleship: discipleshipGrowth,
    fetchDiscipleshipGrowth,
    loading: dGLoading,
    error: dGError,
  } = useGetDiscipleshipGrowth({
    authorization: "group_leader",
    granularity: dGranularity,
    filterId: userId,
  });
  const dEndExclusive = dRange?.to
    ? new Date(
        dRange.to.getFullYear(),
        dRange.to.getMonth(),
        dRange.to.getDate() + 1
      )
    : null;
  const applyDiscipleshipGrowth = () => {
    fetchDiscipleshipGrowth(
      dGranularity,
      null,
      dRange?.from ?? null,
      dEndExclusive
    );
  };
  return (
    <div className="px-4 py-10 lg:px-14 min-h-screen min-w-screen flex flex-col gap-y-20 xl:gap-y-10 xl:grid xl:grid-cols-2 xl:gap-x-10 pt-21">
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
            <div className="w-full xl:w-1/2">
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
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-full min-h-full col-span-2 space-y-3 items-center">
          <h2 className="w-full font-semibold text-2xl">Discipleship Data</h2>
          {discipleshipLoading ? (
            <>
              <Skeleton className="h-full w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            discipleship && (
              <div className="w-full">
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
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-full min-h-full col-span-2 space-y-3">
          <h2 className="w-1/2 font-semibold text-2xl mb-4">Growth Tracks</h2>
          {growthLoading ? (
            <>
              <Skeleton className="h-full w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </>
          ) : (
            growth && (
              <div>
                <GrowthTable data={growth} />
              </div>
            )
          )}
        </div>
      </div>
      <div>
        {gGLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          giftsGrowth && (
            <div className="w-full">
              <Card className="border-stone-300 shadow-lg">
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Select
                        value={gGranularity}
                        onValueChange={(v) => setGGranularity(v as any)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Granularity" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {GRANULARITIES.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <DateRangePicker value={gRange} onChange={setGRange} />

                      <Button onClick={applyGiftsGrowth} disabled={gGLoading}>
                        {gGLoading ? "Loading…" : "Apply"}
                      </Button>
                    </div>

                    {gGError && (
                      <div className="text-red-600 text-sm">{gGError}</div>
                    )}

                    <GiftsOverTime
                      gifts={giftsGrowth}
                      granularity={gGranularity}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        )}
      </div>
      <div>
        {" "}
        {mGLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          ministryGrowth && (
            <div className="w-full">
              <Card className="border-stone-300 shadow-lg">
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Select
                        value={mGranularity}
                        onValueChange={(v) => setMGranularity(v as any)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Granularity" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {GRANULARITIES.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <DateRangePicker value={mRange} onChange={setMRange} />

                      <Button
                        onClick={applyMinistryGrowth}
                        disabled={mGLoading}
                      >
                        {mGLoading ? "Loading…" : "Apply"}
                      </Button>
                    </div>

                    {mGError && (
                      <div className="text-red-600 text-sm">{mGError}</div>
                    )}

                    <MinistryOverTime
                      ministries={ministryGrowth}
                      granularity={mGranularity}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        )}
      </div>
      <div className="col-span-2">
        {dGLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          discipleshipGrowth && (
            <div className="w-full col-span-2">
              <Card className="border-stone-300 shadow-lg">
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Select
                        value={dGranularity}
                        onValueChange={(v) => setDGranularity(v as any)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Granularity" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {GRANULARITIES.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <DateRangePicker value={dRange} onChange={setDRange} />

                      <Button
                        onClick={applyDiscipleshipGrowth}
                        disabled={dGLoading}
                      >
                        {dGLoading ? "Loading…" : "Apply"}
                      </Button>
                    </div>

                    {dGError && (
                      <div className="text-red-600 text-sm">{dGError}</div>
                    )}

                    <DiscipleshipOneUserChart
                      discipleship={discipleshipGrowth}
                      granularity={dGranularity}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MemberDetail;
