import React from "react";
import { useViewManagedGroups } from "../../../../../groups/useViewManagedGroups";
import { BsPersonFillAdd, BsPersonFillDash } from "react-icons/bs";
import { useState } from "react";
import GroupManager from "./GroupManager";
const ManageGroup = ({ memberMap }) => {
  const { leaderGroup, coLeaderGroup, loading, error } = useViewManagedGroups();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      Manage Group
      {leaderGroup.length > 0 ? (
        <GroupManager
          groupType="Leader"
          group={leaderGroup}
          memberMap={memberMap}
        />
      ) : null}
      {coLeaderGroup.length > 0 ? (
        <GroupManager
          groupType="Co-leader"
          group={leaderGroup}
          memberMap={memberMap}
        />
      ) : null}
    </div>
  );
};

export default ManageGroup;
