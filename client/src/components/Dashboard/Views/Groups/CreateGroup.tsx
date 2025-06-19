import React from "react";
import { useState } from "react";
import { useCreateGroup } from "../../../../groups/useCreateGroup"; // Adjust the import path as necessary
import toast from "react-hot-toast"

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const { createGroup, loading } = useCreateGroup();

  const handleNewGroup = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    const result = await createGroup({
      name: name,
      description: description,
    });
    if (result.success) {
      setName("");
      setDescription("");
      toast.success("Successfully created group, reloading to see changes.")
      setTimeout(() => {window.location.reload()}, 300)
    } else {
      setName("");
      setDescription("");
      console.error("Error creating group:", result.error);
      setError("An nerror occurred while creating the group please try again.");
    }
  };

  return (
    <>
      {/* <p className="text-red-500">
        TEMP: GLOBAL_ROLE {role}, GROUP_ROLE {ownership}
      </p> */}
      <>
        <form
          onSubmit={handleNewGroup}
          className="flex flex-col max-w-md m-auto"
          action=""
        >
          <input
            onChange={(e) => setName(e.target.value)}
            placeholder="Group Name"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            name=""
            id=""
          />
          <input
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Group Description"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            name=""
            id=""
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-2 py-0.5 rounded-md"
          >
            Create Group
          </button>
          {error && (
            <p className="text-red-600 text-center pt-4 whitespace-pre-line">
              {error}
            </p>
          )}
        </form>
      </>
    </>
  );
};

export default CreateGroup;
