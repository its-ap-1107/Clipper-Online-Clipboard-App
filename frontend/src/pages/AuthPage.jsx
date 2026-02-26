import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function AuthPage({ mode }) {
    const isSignup = mode === "signup";
    const navigate = useNavigate();
    const { login, signup } = useAuth();
    const { showToast } = useToast();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const submit = (event) => {
        event.preventDefault();
        if (!form.email || !form.password || (isSignup && !form.name)) {
            showToast("error", "All required fields are needed.");
            return;
        }

        const result = isSignup
            ? signup(form.name, form.email, form.password)
            : login(form.email, form.password);

        if (!result.ok) {
            showToast("error", result.message);
            return;
        }

        showToast("success", isSignup ? "Signup complete." : "Logged in.");
        navigate("/");
    };

    return (
        <main className="container auth-wrap fade-up">
            <form className="auth-card" onSubmit={submit}>
                <h2>{isSignup ? "Create account" : "Welcome back"}</h2>
                {isSignup ? (
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(event) => updateForm("name", event.target.value)}
                    />
                ) : null}
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(event) => updateForm("password", event.target.value)}
                />
                <button type="submit" className="btn btn-primary auth-btn">
                    {isSignup ? "Sign up" : "Login"}
                </button>
            </form>
        </main>
    );
}
