import React from "react";
import { useOwnership } from "../../../../groups/useOwnership";
import CreateGroup from "./CreateGroup";
import ManageGroup from "./Manager/ManageGroup";
import GeneralView from "./General/GeneralView";
import GroupInvitations from "./GroupInvitations";

const Groups = ({ role }) => {
  const memberMap = ["Leader", "Apprentice", "Assistant", "General"];
  var otherGroups = false;
  const { ownerships, loading, ownError } = useOwnership();
  if (loading) return <p>Loading...</p>;
  if (ownError)
    return p(
      <p className="text-red-600">Error fetching ownership: {ownError}</p>
    );
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
    if (!ownerships) {
      return true;
    }
    for (const ownership of ownerships) {
      if (ownership === 1) {
        return false;
      }
    }
    return true;
  };

  const manageAccess = setManageAccess();
  const createAccess = setCreateAccess();
  return (
    <div className="px-2">
      <h1 className="text-2xl my-2 font-semibold border-stone-300">
        Group Settings
      </h1>
      <div className="group-management">
        {manageAccess ? <ManageGroup memberMap={memberMap} /> : null}
      </div>
      <div className="view-group">
        <GeneralView memberMap={memberMap} otherGroups={otherGroups} />
      </div>
      {createAccess ? (
        <CreateGroup />
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
