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

export const DeleteUserConfirmDialog = ({
  email,
  onConfirm,
}: {
  email: string;
  onConfirm: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="shadow-md btn-danger">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-stone-300 z-[9999]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this user?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-red-500">
              This action is irreversible.{" "}
              <strong>
                THIS ACTION WILL REMOVE THE USER AND <i>ALL RELATED DATA</i>{" "}
                FROM THE APPLICATION
              </strong>
            </span>
            <br /> Type the users email to continue: <strong>{email}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter users email"
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
            disabled={inputValue !== email}
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
