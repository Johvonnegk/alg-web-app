import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { useGetGroupInvitations } from "../../../../groups/useGetGroupInvitations";
import { useHandleInvites } from "../../../../groups/useHandleInvites";
const GroupInvitations = () => {
  const { invites, loading } = useGetGroupInvitations();
  const { updateInvites, loading: invLoading, error } = useHandleInvites();
  if (loading) return <p>Loading...</p>;
  const handleInvite = async (accepted, inviteId) => {
    const success = await updateInvites({ accepted, inviteId });
    if (success) {
      console.log(
        `Successfully ${accepted ? "accepted" : "declined"} the invite`
      );
    } else {
      console.error("Failed to accpet invite");
    }
  };

  return (
    <div>
      <h3>Group Invitations</h3>
      <ul className="w-1/2 bg-stone-400 px-2 py-0.5 rounded-md">
        {invites?.map((invite) => {
          return (
            <li className="flex justify-between" key={invite.id}>
              <div>
                <p>
                  <span className="text-accent">{invite.sender.fname}</span>{" "}
                  invited you to join{" "}
                  <span className="text-accent">{invite.groups.name}?</span>
                </p>
              </div>
              <div className="status">{invite.status}...</div>
              <button
                className="cursor-pointer"
                onClick={() => handleInvite(true, invite.id)}
              >
                <FaCheckCircle />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => handleInvite(false, invite.id)}
              >
                <FaMinusCircle />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GroupInvitations;
