import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'

const login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')
  const { session, signInUser } = UserAuth()
  const navigate = useNavigate()
  console.log(session)

  const handleLogIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signInUser(email, password)

      if (result.success){
        navigate('/dashboard')
      }
    } catch (error){
      setError("An error occured")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <form onSubmit={handleLogIn} className="max-w-md m-auto pt-24" action="">
      <h2 className="font-bold pb-2">Login</h2>
      <p>Don't have have an account? <Link to="/signup">Sign Up!</Link></p>
      <div className="flex flex-col py-4">
        <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 mt-6" type="email" name="" id=""/>
        <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-3 mt-6" type="password" name="" id=""/>
        <button type="submit" disabled={loading} className="mt-4">Log In</button>
      </div>
      {error && <p className="text-red-600 text-center pt-4">{error}</p>}
    </form>  
    </>
  )
}

export default login