import React from "react";
import { TbFaceIdError } from "react-icons/tb";

const Dashboard404 = () => {
  return (
    <div className="flex flex-col items-center text-accent">
      <TbFaceIdError size={200} />
      <div className="text-lg">
        Could not load the page you were looking for
      </div>
    </div>
  );
};

export default Dashboard404;
