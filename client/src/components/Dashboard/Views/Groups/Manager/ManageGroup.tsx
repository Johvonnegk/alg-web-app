import React from "react";
import GroupManager from "./GroupManager";
import { GroupMember } from "@/types/Group";
interface ManageGroupProps {
  leaderGroup: GroupMember[];
  coLeaderGroup: GroupMember[];
}
const ManageGroup = ({ leaderGroup, coLeaderGroup }: ManageGroupProps) => {
  return (
    <div className="w-full flex flex-col">
      <h3 className=" text-xl mb-2">Manage Groups</h3>
      <hr className="mb-20 text-stone-300 w-7/8" />
      <div>
        {leaderGroup && leaderGroup.length > 0 ? (
          <GroupManager group={leaderGroup} />
        ) : null}
      </div>
      <div>
        {coLeaderGroup && coLeaderGroup.length > 0 ? (
          <GroupManager group={coLeaderGroup} />
        ) : null}
      </div>
    </div>
  );
};

export default ManageGroup;
