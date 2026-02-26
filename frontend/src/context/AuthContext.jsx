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

    const login = (email, password) => {
        const accounts = JSON.parse(localStorage.getItem("clipper_accounts") || "[]");
        const found = accounts.find(
            (account) => account.email === email && account.password === password
        );
        if (!found) {
            return { ok: false, message: "Invalid email or password." };
        }
        const session = { name: found.name, email: found.email };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        setUser(session);
        return { ok: true };
    };

    const signup = (name, email, password) => {
        const accounts = JSON.parse(localStorage.getItem("clipper_accounts") || "[]");
        const exists = accounts.some((account) => account.email === email);
        if (exists) {
            return { ok: false, message: "Account already exists for this email." };
        }
        const next = [...accounts, { name, email, password }];
        localStorage.setItem("clipper_accounts", JSON.stringify(next));
        const session = { name, email };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        setUser(session);
        return { ok: true };
    };

    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
    };

    const value = useMemo(
        () => ({ user, login, signup, logout }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
