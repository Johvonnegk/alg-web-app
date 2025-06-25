import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const LeaveGroupDialog = ({
  groupName,
  onConfirm,
}: {
  groupName: string;
  onConfirm: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mb-10 btn-danger">Leave Group</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-stone-300 z-[9999]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-red-500">
              This action is irreversible.{" "}
              <strong>
                FOR GROUP LEADERS THIS WILL DELETE THE WHOLE GROUP, REMOVING ALL
                MEMBERS FROM THE GROUP.
              </strong>
            </span>
            <br /> Type the group name to continue: <strong>{groupName}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter group name"
        />
        <AlertDialogDescription className="text-stone-600 font-semibold">
          **case sensitive**
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="disabled:bg-red-400 enabled:bg-red-500 enabled:text-white enabled:hover:bg-red-600"
            disabled={inputValue !== groupName}
            onClick={() => {
              onConfirm();
              setInputValue("");
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
