import React, { useState } from "react";
import toast from "react-hot-toast";
import { DataTable } from "./Table/data-table";
import { columns as baseColumns } from "./Table/columns";
import { useGetUsers } from "@/hooks/admin/useGetUsers";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/context/AuthContext";
import { useManageAdminRoles } from "@/hooks/admin/useManageAdminRoles";
import { useDeleteUser } from "@/hooks/admin/useDeleteUser";
const Admin = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { email: sessionEmail } = useAuth();
  const { role, loading: roleLoading, error: roleError } = useUserRole();
  const { handleDelete: remove, loading: removeLoading } = useDeleteUser();
  const { handlePromotion: promote, loading: promoteLoading } =
    useManageAdminRoles();
  const handlePromotion = async (promotion: boolean, email: string) => {
    const result = await promote(promotion, email);
    if (result.success && promotion) {
      toast.success("Successfully promoted user");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else if (result.success && !promotion) {
      toast.success("Successfully demoted user");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      toast.error("Could not manage members, please try again.");
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
    selectedUsers,
    toggleUserSelection,
  });
  return (
    <div>
      <DataTable columns={columns} data={userList} />
    </div>
  );
};

export default Admin;
