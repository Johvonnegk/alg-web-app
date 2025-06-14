import React from "react";
import { useState } from "react";
import { useInviteToGroup } from "../../../../../groups/useInviteToGroup";
const GroupManager = ({ groupType, group, memberMap }) => {
  const [email, setEmail] = useState("");
  const groupName = group[0]?.groups.name;
  const groupId = group[0]?.groups.id;
  const { inviteToGroup: invite, loading: invLoading } = useInviteToGroup();
  const sendInvite = async (e) => {
    e.preventDefault();
    console.log("EMAIL: ", email);
    const result = await invite(groupId, email);
    if (result.success) {
      console.log("Join request sent successfully");
    } else {
      console.error("An error occurerd while sending the invite");
    }
    setEmail("");
  };
  return (
    <div className="group-management">
      <div className="managed-members">
        <p>
          You are the {groupType} of{" "}
          <span className="text-accent">{groupName}</span>
        </p>
        <p className="text-xs text-stone-400">
          *Select a person then click the remove button to remove them*
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
      <div className="add-member">
        <form
          onSubmit={sendInvite}
          className="flex flex-col w-md m-auto"
          action=""
        >
          <label htmlFor="email">
            Add user to{" "}
            <span className="text-accent">{group[0]?.groups.name}</span>
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name="email"
            placeholder="Email"
            className="p-3 mt-6 bg-gray-50"
          />
          <button
            type="submit"
            disabled={invLoading}
            className="bg-accent text-white px-2 py-0.5 rounded-md"
          >
            Invite User
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupManager;
