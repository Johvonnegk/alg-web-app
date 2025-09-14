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
      <div className="w-fit self-center xl:self-auto xl:w-full">
        <h3 className="self-center text-xl mb-2 xl:self-start">
          Manage Groups
        </h3>
        <hr className="mb-2 xl:mb-10 text-stone-300 xl:w-7/8" />
      </div>
      <div>
        {leaderGroup && leaderGroup.length > 0 ? (
          <div className="flex flex-col mb-10 xl:mb-20">
            <GroupManager group={leaderGroup} />
            <hr className="w-full mt-10 mb-2 xl:mb-10 text-stone-300 xl:w-7/8 self-center" />
          </div>
        ) : null}
      </div>
      <div>
        {coLeaderGroup && coLeaderGroup.length > 0 ? (
          <div className="flex flex-col mb-10 xl:mb-20">
            <GroupManager group={coLeaderGroup} />
            <hr className="w-full mt-10 mb-2 xl:mb-10 text-stone-300 xl:w-7/8 self-center" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ManageGroup;
