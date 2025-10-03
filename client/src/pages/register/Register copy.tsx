import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface FromValues {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

const Register = () => {
  const [values, setValues] = useState<FromValues>({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, signUpNewUser } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const signupInfo = values;
    try {
      const result = await signUpNewUser(signupInfo);
      if (result.success) {
        navigate("/dashboard");
        toast.success("Successfully registered");
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
        <h2 className="text-lg font-bold pb-2">Sign Up</h2>
        <p>
          Already have an account?{" "}
          <Link className="hover:text-accent" to="/login">
            Login!
          </Link>
        </p>
        <div className="flex flex-col py-4 w-full">
          <input
            onChange={(e) => handleChange(e)}
            placeholder="First Name"
            className="p-3 mt-6 bg-gray-50"
            value={values.fname}
            name="fname"
            type="text"
            id=""
          />
          <input
            onChange={(e) => handleChange(e)}
            placeholder="Last Name"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            value={values.lname}
            name="lname"
            id=""
          />
          <input
            onChange={(e) => handleChange(e)}
            placeholder="Email"
            className="p-3 mt-6 bg-gray-50"
            type="email"
            value={values.email}
            name="email"
            id=""
          />
          <input
            onChange={(e) => handleChange(e)}
            placeholder="Password"
            className="p-3 mt-6 bg-gray-50"
            type="password"
            value={values.password}
            name="password"
            id=""
          />
          <input
            onChange={(e) => handleChange(e)}
            placeholder="Confirm Password"
            className="p-3 mt-6 bg-gray-50"
            type="password"
            value={values.confirmPassword}
            name="confirmPassword"
            id=""
          />
          <input
            onChange={(e) => handleChange(e)}
            placeholder="Phone Number"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            value={values.phone}
            name="phone"
            id=""
          />
          <input
            onChange={(e) => handleChange(e)}
            placeholder="Address"
            className="p-3 mt-6 bg-gray-50"
            type="text"
            value={values.address}
            name="address"
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

export default Register;
