import { useState, useEffect } from "react";
import { FiPlus, FiMinus, FiLogOut } from "react-icons/fi";
import { MdAccountCircle, MdGroups } from "react-icons/md";
import { FaFireAlt, FaGift, FaCross } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import { Command } from "cmdk";

export const CommandMenu = ({ open, setOpen }) => {
  const [input, setInput] = useState("");
  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 bg-stone-950/50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border-stone-300 border overflow-hidden w-full max-w-lg mx-auto mt-12"
      >
        <Command.Input
          value={input}
          onValueChange={setInput}
          placeholder="What are you looking for?"
          className="relative border-b border-stone-300 p-3 text-lg w-full placegholder:text-stone-400 focus:outline-none"
        />
        <Command.List className="p-3">
          <Command.Empty>
            No results for{" "}
            <span className="text-accent font-semibold">"{input}"</span>
          </Command.Empty>

          <Command.Group
            heading="Account"
            className="text-sm mb-3 text-stone-400"
          >
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <MdAccountCircle className="text-blue-600" />
              Account Details & Settings
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FiLogOut className="text-red-500" />
              Sign Out
            </Command.Item>
          </Command.Group>
          <Command.Group
            heading="Growth"
            className="text-sm mb-3 text-stone-400"
          >
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <RiPlantFill className="text-green-600" />
              Growth Tracks
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FaGift className="text-yellow-600" />
              Spiritual Gifts
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FaFireAlt className="text-red-600" />
              My Passions
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FaCross className="text-amber-900" />
              Discipleship
            </Command.Item>
          </Command.Group>
          <Command.Group
            heading="Groups"
            className="text-sm mb-3 text-stone-400"
          >
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <MdGroups className="text-blue-600" />
              Manage Groups
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FiPlus className="text-green-600" />
              Join Group
            </Command.Item>
            <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <FiMinus className="text-red-500" />
              Leave Group
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
