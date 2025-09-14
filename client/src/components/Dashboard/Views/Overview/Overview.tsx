import React from "react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { columns as giftColumns } from "@/components/Tables/SurveyTables/GiftsTable/columns";
import { columns as minColumns } from "@/components/Tables/SurveyTables/MinistriesTable/columns";
import { columns as discColumns } from "@/components/Tables/SurveyTables/DiscipleshipTable/columns";
import Profile from "@/components/Profile/Profile";
import { DataTable } from "@/components/Tables/SurveyTables/data-table";
import GrowthTable from "@/components/Tables/GrowthTracksTables/GrowthTable";
import { UserProfile } from "@/types/UserProfile";
import { useGetMinistry } from "@/hooks/surveys/useGetMinistry";
import { useGetGifts } from "@/hooks/surveys/useGetGifts";
import { useGetDiscipleship } from "@/hooks/surveys/useGetDiscipleship";
import { useGetGrowth } from "@/hooks/growth/useGetGrowth";
import GiftsOverTime from "@/components/Charts/GiftsOverTime";
import MinistryOverTime from "@/components/Charts/MinistryOverTime";
import { useGetGiftsGrowth } from "@/hooks/charts/useGetGiftsGrowth";
import { DiscipleshipOneUserChart } from "@/components/Charts/DiscipleshipOverTimeOneUser";
import { useGetDiscipleshipGrowth } from "@/hooks/charts/useGetDiscipleShipGrowth";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Divide } from "lucide-react";
interface OverviewProps {
  profile: UserProfile; // Replace 'any' with the actual type of profile if known
}
const GRANULARITIES = ["day", "week", "month", "quarter", "year"] as const;
const Overview: React.FC<OverviewProps> = ({ profile }) => {
  const [gGranularity, setGGranularity] = useState("month");
  const [gRange, setGRange] = React.useState<DateRange | undefined>();
  const [mGranularity, setMGranularity] = useState("month");
  const [mRange, setMRange] = React.useState<DateRange | undefined>();
  const [dGranularity, setDGranularity] = useState("month");
  const [dRange, setDRange] = React.useState<DateRange | undefined>();
  const { ministries, loading: minLoading, error: minError } = useGetMinistry();
  const { gifts, loading: giftsLoading, error: giftsError } = useGetGifts();
  const { growth, loading: growthLoading, error: growthError } = useGetGrowth();
  const {
    discipleship,
    loading: discipleshipLoading,
    error: discipleshipError,
  } = useGetDiscipleship();
  const {
    gifts: giftsGrowth,
    fetchGiftsGrowth,
    loading: gGLoading,
    error: gGError,
  } = useGetGiftsGrowth({
    authorization: null,
    granularity: gGranularity,
    filterId: profile.user_id,
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
    authorization: null,
    granularity: mGranularity,
    filterId: profile.user_id,
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
    authorization: null,
    granularity: dGranularity,
    filterId: profile.user_id,
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

                    <Button onClick={applyMinistryGrowth} disabled={mGLoading}>
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
  );
};

export default Overview;
