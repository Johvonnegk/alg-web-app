import React from "react";
import { useViewGeneralGroups } from "@/hooks/groups/useViewGeneralGroup";
import { useLeaveGroup } from "@/hooks/groups/useLeaveGroup";
interface GeneralViewProps {
  otherGroups?: boolean;
}
import GroupDescCard from "../GroupDescCard";
import toast from "react-hot-toast";
import { columns } from "@/components/Tables/GroupsTables/GeneralGroupTable/columns";
import { DataTable } from "@/components/Tables/GroupsTables/GeneralGroupTable/data-table";
import { Button } from "@/components/ui/button";

const GeneralView = ({ otherGroups }: GeneralViewProps) => {
  const { group, loading, error } = useViewGeneralGroups();
  const { leaveGroup: leave, loading: leaveLoading } = useLeaveGroup();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  const groupName = group && group?.length > 0 ? group[0]?.groups?.name : null;
  const groupId = group && group?.length > 0 ? group[0]?.groups?.id : null;
  const groupDesc =
    group && group?.length > 0 ? group[0]?.groups?.description : "";

  const leaveGroup = async () => {
    const id = groupId ?? 0;
    const result = await leave(id);
    if (!result.success) toast.error(`An error occured: ${result.error ?? ""}`);
    else {
      toast.success("You have left the group");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };
  return (
    <div className="view-group w-full flex justify-center">
      {group ? (
        <div className="flex flex-col gap-y-10 lg:flex-row gap-x-10">
          <div className="flex flex-col items-center">
            <h3 className="text-xl text-center">Welcome to {groupName}</h3>
            <hr className="text-stone-300 w-full" />
            <div className="flex overflow-x-hidden flex-col gap-y-5">
              <div className="inline-block overflow-x-scroll">
                <DataTable columns={columns} data={group} />
              </div>
              <Button
                onClick={() => leaveGroup()}
                className="btn-danger self-center"
              >
                Leave Group
              </Button>
            </div>
          </div>
          <div className="self-center">
            <GroupDescCard group={group} edit={false} />
          </div>
        </div>
      ) : (
        <p className="text-stone-500">
          You are not in any {otherGroups ? "other " : ""}groups
        </p>
      )}
    </div>
  );
};

export default GeneralView;
