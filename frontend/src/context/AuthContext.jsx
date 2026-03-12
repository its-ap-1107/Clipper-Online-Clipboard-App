import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "clipper_user";

export const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to login");
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
            localStorage.setItem("clipper_token", data.token);
            setUser(data.user);
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to register");
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
            localStorage.setItem("clipper_token", data.token);
            setUser(data.user);
            return { ok: true };
        } catch (err) {
            return { ok: false, message: err.message };
        }
    };

    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem("clipper_token");
        setUser(null);
    };

    const value = useMemo(
        () => ({ user, login, signup, logout }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
