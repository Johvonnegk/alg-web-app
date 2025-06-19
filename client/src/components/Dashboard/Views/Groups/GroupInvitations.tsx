import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { useGetGroupInvitations } from "../../../../groups/useGetGroupInvitations";
import { useHandleInvites } from "../../../../groups/useHandleInvites";
const GroupInvitations = () => {
  const { invites, loading } = useGetGroupInvitations();
  const { updateInvites, loading: invLoading, error } = useHandleInvites();
  if (loading) return <p>Loading...</p>;
  const handleInvite = async (accepted: boolean, inviteId: number) => {
    const success = await updateInvites({ accepted, inviteId });
    if (success) {
      console.log(
        `Successfully ${accepted ? "accepted" : "declined"} the invite`
      );
    } else {
      console.error("Failed to accpet invite: ", error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold tracking-wide">Group Invitations</h3>
      <ul className="w-1/2 py-0.5">
        {invites && invites.length > 0 ? (
          invites?.map((invite, index) => {
            return (
              <li
                className={`flex justify-between rounded-lg px-2 py-2 ${
                  index % 2 === 0 ? "bg-stone-200" : "bg-stone-100"
                }`}
                key={invite.id}
              >
                <div>
                  <p>
                    <span className="text-accent">{invite.sender.fname}</span>{" "}
                    invited you to join{" "}
                    <span className="text-accent">{invite.groups.name}?</span>
                  </p>
                </div>
                <div className="status">
                  {invite.status === "accepted"
                    ? "Accepted invite"
                    : `${
                        invite.status.charAt(0).toUpperCase() +
                        invite.status.slice(1)
                      }...`}
                </div>
                <button
                  className="text-accent cursor-pointer"
                  onClick={() => handleInvite(true, invite.id)}
                >
                  <FaCheckCircle />
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() => handleInvite(false, invite.id)}
                >
                  <FaMinusCircle className="text-accent" />
                </button>
                <button className="bg-accent text-white cursor-pointer rounded px-2 py-0.5">
                  Clear
                </button>
              </li>
            );
          })
        ) : (
          <span className="text-stone-500">You have no group invites</span>
        )}
      </ul>
    </div>
  );
};

export default GroupInvitations;
