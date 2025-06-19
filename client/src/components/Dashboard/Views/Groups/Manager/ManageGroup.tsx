import React from "react";
import GroupManager from "./GroupManager";
import { GroupMember } from "../../../../../types/Group"
interface ManageGroupProps {
  memberMap: string[],
  leaderGroup: GroupMember[],
  coLeaderGroup: GroupMember[],
}
const ManageGroup = ({ memberMap, leaderGroup, coLeaderGroup }: ManageGroupProps) => {
  return (
    <div>  
      Manage Group
      {leaderGroup && leaderGroup.length > 0 ? (
        <GroupManager
          groupType="Leader"
          group={leaderGroup}
          memberMap={memberMap}
        />
      ) : null}
      {coLeaderGroup && coLeaderGroup.length > 0 ? (
        <GroupManager
          groupType="Co-leader"
          group={coLeaderGroup}
          memberMap={memberMap}
        />
      ) : null}
    </div>
  );
};

export default ManageGroup;
