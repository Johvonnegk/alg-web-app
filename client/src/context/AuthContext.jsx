import React from 'react'
import { createContext, useEffect, useState, useContext } from 'react'
import { supabase } from '../supabaseClient'
const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    // Sign In
    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) {
                console.error("There was a problem loggin in: ", error)
                return { success: false, error: error.message}
            }
            console.log("log-in succes: ", data)
            return {success: true, data}
        } catch (error) {
            console.error("[ERROR] An error occured while loggin in: ", error)
        }
    }

    // Sign Up
    const signUpNewUser = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,   
        })

        if (error) {
            console.error("There was a problem signing up: ", error)
            return { success: false, error}
        }
        return {success: true, data}
    }

    useEffect(() =>{
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    // Sign Out
    const signOut = () => {
        const { error } = supabase.auth.signOut()
        if (error){
            console.error("There was an error: ", error)
        }
    }

    return (
        <AuthContext.Provider value={{session, signInUser, signUpNewUser, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}