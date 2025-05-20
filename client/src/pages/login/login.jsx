import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const { session, signInUser } = UserAuth();
  const navigate = useNavigate();
  console.log(session);

  const handleLogIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogIn}
        className="flex flex-col items-center max-w-md m-auto"
        action=""
      >
        <h2 className="font-bold pb-2">Login</h2>
        <p>
          Don't have have an account?{" "}
          <Link className="hover:text-accent" to="/signup">
            Sign Up!
          </Link>
        </p>
        <div className="flex flex-col py-4 w-full">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 mt-6 bg-gray-50"
            type="email"
            name=""
            id=""
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 mt-6 bg-gray-50"
            type="password"
            name=""
            id=""
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-10 bg-accent w-1/2 text-white py-2 rounded-md self-center"
          >
            Log In
          </button>
        </div>
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </>
  );
};

export default login;
