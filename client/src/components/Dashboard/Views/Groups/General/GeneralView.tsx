import React from "react";
import { useViewGeneralGroups } from "../../../../../groups/useViewGeneralGroup";
import { GroupMember } from "../../../../../types/Group"
interface GeneralViewProps {
  memberMap: string[];
  otherGroups?: boolean;
}

const GeneralView = ({ memberMap, otherGroups }: GeneralViewProps) => {
  const { group, loading, error } = useViewGeneralGroups();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  const groupName = group && group?.length > 0 ? group[0]?.groups?.name : null;

  return (
    <div className="view-group">
      {group ? (
        <div className="view-members">
          <p>
            Welcome to <span className="text-accent">{groupName}</span>
          </p>
          <ul className="py-0.5 rounded-md">
            {group?.map((member: GroupMember, index: number) => (
              <li
                key={member.user_id}
                className={`flex justify-between w-1/5 px-2 py-0.5 rounded-md ${
                  index % 2 === 0 ? "bg-stone-200" : "bg-stone-100"
                }`}
              >
                <span>
                  {member.users.fname} {member.users.lname}
                </span>
                <span className="group-role">
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
