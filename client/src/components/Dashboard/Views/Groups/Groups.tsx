import React from "react";
import { useOwnership } from "../../../../hooks/groups/useOwnership";
import CreateGroup from "./CreateGroup";
import ManageGroup from "./Manager/ManageGroup";
import GeneralView from "./General/GeneralView";
import { useCreateAccess } from "../../../../hooks/groups/useCreateAccess";
import GroupInvitations from "./GroupInvitations";
import { useViewManagedGroups } from "../../../../hooks/groups/useViewManagedGroups";
import AllGroups from "./General/AllGroups";
import toast from "react-hot-toast";

const Groups = ({ role }) => {
  const memberMap = ["Leader", "Apprentice", "Assistant", "General"];
  var otherGroups = false;
  const { ownerships, loading: ownLoading, error: ownError } = useOwnership();
  const {
    allowed,
    loading: createLoading,
    error: allowError,
  } = useCreateAccess();
  const {
    leaderGroup,
    coLeaderGroup,
    loading: groupLoading,
    error: groupError,
  } = useViewManagedGroups();
  if (ownLoading || createLoading || groupLoading) return <p>Loading...</p>;
  if (ownError) {
    return <p className="text-red-600">Error fetching ownership: {ownError}</p>;
  } else if (allowError) {
    return (
      <p className="text-red-600">
        Error fetching create group access: {allowError}
      </p>
    );
  } else if (groupError) {
    return <p className="text-red-600">Error fetching groups: {groupError}</p>;
  }
  const setManageAccess = () => {
    if (!ownerships) {
      return false;
    }
    for (const ownership of ownerships) {
      if ([1, 2].includes(ownership)) {
        otherGroups = true;
        return true; // If any ownership has role_id 1 or 2, return true
      }
    }
    return false; // If no ownership has role_id 1 or 2, return false
  };

  const setCreateAccess = () => {
    if (allowed) {
      if (!ownerships) {
        return true;
      }
      for (const ownership of ownerships) {
        if (ownership === 1) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  const manageAccess = setManageAccess();
  const createAccess = setCreateAccess();
  return (
    <div className="px-14">
      <h1 className="text-2xl mb-2 font-semibold border-stone-300">
        Group Settings
      </h1>
      <hr className="mb-20 text-stone-300 w-7/8" />
      <div className="groups-contianer grid grid-cols-2 gap-x-20 gap-y-15">
        <div className="view-group">
          <GeneralView memberMap={memberMap} otherGroups={otherGroups} />
        </div>
        <div>
          <GroupInvitations />
        </div>
        <div className="group-management col-span-2">
          {manageAccess ? (
            <ManageGroup
              leaderGroup={leaderGroup}
              coLeaderGroup={coLeaderGroup}
              memberMap={memberMap}
            />
          ) : null}
        </div>
        <div className="col-span-2 flex justify-center">
          {createAccess ? (
            <CreateGroup />
          ) : (
            "You cannot create groups right now"
          )}
        </div>
        <div className="col-span-2">
          <AllGroups />
        </div>
      </div>
    </div>
  );
};

export default Groups;
