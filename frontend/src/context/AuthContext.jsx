import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({children}){
  
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect (() => {
    const storedUser = localStorage.getItem("ecommerce_user")
    
    if(storedUser){
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)

  },[])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("ecommerce_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ecommerce_user")
  }

  return (
    <AuthContext.Provider value={{ user,login,logout,loading }}>
      {children}
    </AuthContext.Provider>
  )
}