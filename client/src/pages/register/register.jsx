import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const signupInfo = {
      email,
      password,
      fname,
      lname,
      phone,
      address,
    };
    try {
      const result = await signUpNewUser(signupInfo);
      if (result.success) {
        navigate("/dashboard");
      } else {
        switch (result.error.code) {
          case "user_already_exists":
            setError(
              "This email is already registered with an account,\n please choose another email address"
            );
            break;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col items-center max-w-md m-auto"
        action=""
      >
        <h2 className="font-bold pb-2">Sign Up</h2>
        <p>
          Already have an account?{" "}
          <Link className="hover:text-accent" to="/login">
            Login!
          </Link>
        </p>
        <div className="flex flex-col py-4 w-full">
          <input
            onChange={(e) => setFname(e.target.value)}
            placeholder="First Name"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            name=""
            id=""
          />
          <input
            onChange={(e) => setLname(e.target.value)}
            placeholder="Last Name"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            name=""
            id=""
          />
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
          <input
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            name=""
            id=""
          />
          <input
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            name=""
            id=""
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-10 bg-accent w-1/2 text-white py-2 rounded-md self-center"
          >
            Sign Up
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-center pt-4 whitespace-pre-line">
            {error}
          </p>
        )}
      </form>
    </>
  );
};

export default register;
