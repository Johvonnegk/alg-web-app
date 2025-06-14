import React from "react";
import { useViewGeneralGroups } from "../../../../../groups/useViewGeneralGroup";

const GeneralView = ({ memberMap, otherGroups }) => {
  const { group, loading, error } = useViewGeneralGroups();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  const groupName = group?.length > 0 ? group[0]?.groups?.name : null;

  return (
    <div className="view-group">
      {group ? (
        <div className="view-members">
          <p>
            Welcome to <span className="text-accent">{groupName}</span>
          </p>
          <ul className="w-1/5 bg-stone-400 px-2 py-0.5 rounded-md">
            {group?.map((member) => (
              <li key={member.user_id} className="flex justify-between">
                <span>
                  {member.users.fname} {member.users.lname}
                </span>
                <span className="group-role text-stone-200">
                  {memberMap[member.role_id - 1]}
                </span>
              </li>
            ))}
          </ul>
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
