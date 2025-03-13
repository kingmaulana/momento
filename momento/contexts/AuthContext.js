import React, { createContext } from "react";

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
    const [ isSignedIn, setIsSignedIn] = React.useState(false)
    return <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
        { children }
    </AuthContext.Provider>
}