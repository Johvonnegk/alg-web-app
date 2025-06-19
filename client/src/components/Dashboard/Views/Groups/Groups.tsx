import React from "react";
import { useOwnership } from "../../../../groups/useOwnership";
import CreateGroup from "./CreateGroup";
import ManageGroup from "./Manager/ManageGroup";
import GeneralView from "./General/GeneralView";
import { useCreateAccess } from "../../../../groups/useCreateAccess";
import GroupInvitations from "./GroupInvitations";
import {useViewManagedGroups} from "../../../../groups/useViewManagedGroups";
import toast from "react-hot-toast"

const Groups = ({ role }) => {
  const memberMap = ["Leader", "Apprentice", "Assistant", "General"];
  var otherGroups = false;
  const { ownerships, loading: ownLoading, error: ownError } = useOwnership();
  const { allowed, loading: createLoading, error: allowError } = useCreateAccess();
  const { leaderGroup, coLeaderGroup, loading: groupLoading, error: groupError, refetch: refetchGroups } = useViewManagedGroups();
  if (ownLoading || createLoading || groupLoading) return <p>Loading...</p>;
  if (ownError){
    return <p className="text-red-600">Error fetching ownership: {ownError}</p>;
  } else if (allowError) {
    return <p className="text-red-600">Error fetching create group access: {allowError}</p>
  } else if (groupError) {
    return <p className="text-red-600">Error fetching groups: {groupError}</p>
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
    <div className="px-2">
      <h1 className="text-2xl my-2 font-semibold border-stone-300">
        Group Settings
      </h1>
      <div className="group-management">
        {manageAccess ? <ManageGroup leaderGroup={leaderGroup} coLeaderGroup={coLeaderGroup} memberMap={memberMap} refetch={refetchGroups} /> : null}
      </div>
      <div className="view-group">
        <GeneralView memberMap={memberMap} otherGroups={otherGroups} />
      </div>
      {createAccess ? (
        <CreateGroup/>
      ) : (
        <p className="text-stone-500 text-sm">
          *You cannot create another group while being the leader of an existing
          group*
        </p>
      )}
      <div>
        <GroupInvitations />
      </div>
    </div>
  );
};

export default Groups;
