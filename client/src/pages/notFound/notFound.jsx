import React from "react";
import { Link } from "react-router-dom";
const notFound = () => {
  return (
    <div>
      <h1>The page you were looking for could not be found.</h1>
      <Link to={"/"}>
        <button>Return Home</button>
      </Link>
    </div>
  );
};

export default notFound;
