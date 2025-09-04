import React from "react";
import { useViewGeneralGroups } from "@/hooks/groups/useViewGeneralGroup";
import { useLeaveGroup } from "@/hooks/groups/useLeaveGroup";
interface GeneralViewProps {
  otherGroups?: boolean;
}
import toast from "react-hot-toast";
import { columns } from "./Table/columns";
import { DataTable } from "./Table/data-table";
import { Button } from "@/components/ui/button";

const GeneralView = ({ otherGroups }: GeneralViewProps) => {
  const { group, loading, error } = useViewGeneralGroups();
  const { leaveGroup: leave, loading: leaveLoding } = useLeaveGroup();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  const groupName = group && group?.length > 0 ? group[0]?.groups?.name : null;
  const groupId = group && group?.length > 0 ? group[0]?.groups?.id : null;

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
      ) : (
        <p className="text-stone-500">
          You are not in any {otherGroups ? "other " : ""}groups
        </p>
      )}
    </div>
  );
};

export default GeneralView;
