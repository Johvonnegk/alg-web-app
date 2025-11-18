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

export const DeleteMeetingDialog = ({
  onConfirm,
}: {
  onConfirm: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="btn-danger">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-stone-300 z-[9999]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this meeting?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-md text-red-500">
              This action is irreversible.{" "}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="disabled:bg-red-400 enabled:bg-red-500 enabled:text-white enabled:hover:bg-red-600"
            onClick={() => {
              onConfirm();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
