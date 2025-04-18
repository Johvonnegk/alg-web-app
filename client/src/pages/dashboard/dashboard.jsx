import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
const dashboard = () => {
  const {session, signOut} = UserAuth();
  const navigate = useNavigate()
  const handleSignOut = async (e) => {
    e.preventDefault()
    try{
      await signOut()
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  return <div>
    <h1>Dashboard</h1>
    <h2>Welcome, {session?.user?.email}</h2>
    <div>
      <p onClick={handleSignOut} className="hover:cursor-pointer border inline-block px-4 py-3 mt-4">Sign Out</p>
    </div>
  </div>;
};

export default dashboard;
