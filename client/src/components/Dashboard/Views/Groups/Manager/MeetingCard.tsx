import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { roleMap } from "@/components/Dashboard/Views/Groups/Groups";
import { format } from "date-fns";
import MeetingManager from "./MeetingManagerEdit";
import MeetingProfilePill from "@/components/Profile/MeetingProfilePill";
import { DeleteMeetingDialog } from "./DeleteMeetingDialog";
import { useDeleteMeeting } from "@/hooks/groups/useDeleteMeeting";
import toast from "react-hot-toast";
const MeetingCard = ({ info }) => {
  const textDate = format(new Date(info.date), "MMM do, yyyy 'at' h:mm a");
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { deleteMeeting } = useDeleteMeeting();
  const classSize = info.attendances.length;
  const studentsPresent = info.attendances.filter((a) => {
    return a.attendance.trim() === "present";
  }).length;
  const handleDelete = async () => {
    const result = await deleteMeeting(info.id, info.group_id);
    if (result.success) {
      toast.success("Deleted meeting");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      toast.error(
        `An error occurred while creating the group: ${result.error}`
      );
    }
  };
  return (
    <div className="">
      {edit ? (
        <div className="flex flex-col gap-y-5">
          <MeetingManager meeting={info} />
          <Button onClick={() => setEdit(!edit)} className="w-full btn-primary">
            Exit Edit Mode
          </Button>
        </div>
      ) : (
        <Card className="border-stone-300 shadow-md h-full">
          <CardHeader>
            <CardTitle>{info.title}</CardTitle>
            <CardDescription>
              <div>
                <span className="font-semibold">Recorded by: </span>
                <span className="text-accent font-semibold">
                  {info.users.fname} {info.users.lname}
                </span>{" "}
                on {textDate}
              </div>
              <div>
                <span className="font-semibold text-stone-400">
                  {roleMap[info.users.role_id]}
                </span>{" "}
                <span className="font-semibold text-stone-400">
                  {info.users.email}
                </span>{" "}
              </div>
              <div>
                <span className="font-semibold">Location held:</span>{" "}
                {info.location ? info.location : "N/A"}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div>
              <h3 className="font-semibold">Meeting Notes</h3>
              <div
                className={`${info.notes ? "" : "text-stone-400"} ${
                  expanded ? "" : "truncate"
                }`}
              >
                <p>{info.notes ? info.notes : "No recorded notes"}</p>
                {info.notes.length > 30 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-accent hover:underline text-sm"
                  >
                    {expanded ? "See less" : "See more"}
                  </button>
                )}
              </div>
            </div>
            <div>
              <button
                onClick={() => setView(!view)}
                className="mt-2 text-accent hover:underline text-sm"
              >
                {view ? "Hide Attendance " : "View Attendance "} List
              </button>
              {view && (
                <div className="flex flex-col gap-y-2 mt-5">
                  <div>
                    <h3 className="font-semibold">Attendance List</h3>
                    <div>
                      {studentsPresent} of {classSize} present
                    </div>
                  </div>
                  <ul>
                    {info.attendances.map((attendee, idx) => (
                      <li key={idx}>
                        <MeetingProfilePill
                          attendance={attendee.attendance}
                          profile={attendee.users}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-x-10">
            <Button onClick={() => setEdit(!edit)} className="btn-primary">
              Edit
            </Button>
            <DeleteMeetingDialog onConfirm={handleDelete} />
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default MeetingCard;
