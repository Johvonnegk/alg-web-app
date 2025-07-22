import React from "react";
import { useViewGeneralGroups } from "../../../../../hooks/groups/useViewGeneralGroup";
interface GeneralViewProps {
  otherGroups?: boolean;
}
import { columns } from "./Table/columns";
import { DataTable } from "./Table/data-table";

const GeneralView = ({ otherGroups }: GeneralViewProps) => {
  const { group, loading, error } = useViewGeneralGroups();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  const groupName = group && group?.length > 0 ? group[0]?.groups?.name : null;

  return (
    <div className="view-group w-full flex justify-center">
      {group ? (
        <DataTable columns={columns} data={group} />
      ) : (
        <p className="text-stone-500">
          You are not in any {otherGroups ? "other " : ""}groups
        </p>
      )}
    </div>
  );
};

export default GeneralView;
