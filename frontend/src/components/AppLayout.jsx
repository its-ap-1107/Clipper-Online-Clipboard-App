import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AppLayout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="app-shell">
            <div className="bg-grid" />
            <header className="topbar">
                <NavLink to="/" className="brand">
                    Clipper
                </NavLink>
                <nav className="topbar-actions">
                    <NavLink to="/login" className="btn btn-ghost">
                        Login
                    </NavLink>
                    <NavLink to="/signup" className="btn btn-primary">
                        Sign up
                    </NavLink>
                    {user ? (
                        <button className="btn btn-outline" onClick={logout}>
                            Logout ({user.name})
                        </button>
                    ) : null}
                </nav>
            </header>
            {children}
        </div>
    );
}
