import React, { useState } from "react";
import toast from "react-hot-toast";
import { DataTable } from "../../../Tables/AdminTables/data-table";
import { columns as baseColumns } from "@/components/Tables/AdminTables/columns";
import { useGetUsers } from "@/hooks/admin/useGetUsers";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/context/AuthContext";
import { useManageAdminRoles } from "@/hooks/admin/useManageAdminRoles";
import { useDeleteUser } from "@/hooks/admin/useDeleteUser";
import { useGetUserGrowth as useGetTotalGrowth } from "@/hooks/admin/useGetUserGrowth";
import UsersPerTier from "@/components/Charts/UsersPerTier";
import TotalUsers from "@/components/Charts/TotalUsers";
import GrowthTrackCompletion from "@/components/Charts/GrowthTrackCompletion";
import { useGetUsersGrowth } from "@/hooks/growth/useGetUsersGrowth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Admin = () => {
  const { email: sessionEmail } = useAuth();
  const [granularity, setGranularity] = useState("month");
  const [cumulative, setCumulative] = useState(true);
  const { role, loading: roleLoading, error: roleError } = useUserRole();
  const { handleDelete: remove, loading: removeLoading } = useDeleteUser();
  const { handlePromotion: promote, loading: promoteLoading } =
    useManageAdminRoles();
  const {
    growth,
    loading: growthLoading,
    error: growthError,
  } = useGetUsersGrowth("admin");
  const {
    growth: totalGrowth,
    fetchGrowth,
    loading: tgLoading,
    error: tgError,
  } = useGetTotalGrowth(granularity, cumulative);
  const handlePromotion = async (newRole: string, email: string) => {
    const result = await promote(newRole, email);
    if (result.success) {
      toast.success("Successfully changed user role");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      toast.error("Could not manage members, please try again.");
    }
  };

  const handleDelete = async (email: string) => {
    const result = await remove(email);
    if (result.success) {
      toast.success("Successfully deleted user");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      toast.error("An error occured while deleting the user");
    }
  };

  const { users: userList, loading, error } = useGetUsers();
  const columns = baseColumns({
    sessionEmail: sessionEmail ?? "",
    userRole: role ?? 5,
    handlePromotion,
    handleDelete,
  });

  return (
    <div className="min-h-screen h-auto px-4">
      <div className="w-full grid grid-cols-3 gap-y-30 gap-x-10">
        <div className="flex flex-col items-center col-span-2">
          <div>Total users in application: {userList.length}</div>
          <DataTable columns={columns} data={userList} />
        </div>
        <div className="flex items-start">
          <Card className="border-accent h-fit w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">
                <h2>Manage the members of the database</h2>
              </CardTitle>
              <CardDescription className="card-description">
                Admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Here you can manage the members of the database. Please keep in
                mind the delete action is{" "}
                <strong className="text-red-500">irreversible.</strong> Also
                keep in mind thhat you can not <i>remove or manage</i> Admins,
                so once you give someone admin access they will remian there
                forever.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="w-full col-span-2">
          <Card className="primary-card">
            <CardContent className="h-100">
              <UsersPerTier data={userList} />
            </CardContent>
          </Card>
        </div>
        <div>
          {growthLoading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            growth && (
              <Card className="primary-card ">
                <CardHeader>
                  <CardTitle> Growth Tracks</CardTitle>
                  <CardDescription className="card-description">
                    Growth track completion of all users
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-100">
                  <GrowthTrackCompletion data={growth} />
                </CardContent>
              </Card>
            )
          )}
        </div>
        <div className="col-span-3">
          {tgLoading ? (
            <div className="w-full flex flex-col items-center space-y-3">
              <Skeleton className="h-[450px] w-[700px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[550px]" />
                <Skeleton className="h-4 w-[500px]" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Card className="primary-card">
                <CardContent className="space-y-4">
                  <TotalUsers
                    data={totalGrowth}
                    granularity={granularity}
                    setGranularity={(g) => {
                      setGranularity(g);
                      fetchGrowth(g, cumulative);
                    }}
                    cumulative={cumulative}
                    setCumulative={(c) => {
                      setCumulative(c);
                      fetchGrowth(granularity, c);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
