import React, { createContext, useContext, useState, ReactNode } from 'react'

type User = {
    id: string
    pseudo: string
    email: string
    role: string
}

type AuthContextType = {
    user: User | null
    token: string | null
    login: (user: User, token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const login = (u: User, t: string) => {
        setUser(u)
        setToken(t)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
