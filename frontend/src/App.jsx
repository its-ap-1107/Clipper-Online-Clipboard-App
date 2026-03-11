import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const AUTH_STORAGE_KEY = "clipper_user";
const CLIPBOARD_STORAGE_KEY = "clipper_entries";

const AuthContext = createContext(null);
const ClipboardContext = createContext(null);
const ToastContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

function useClipboard() {
  return useContext(ClipboardContext);
}

function useToast() {
  return useContext(ToastContext);
}

function AuthProvider({ children }) {
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

function ClipboardProvider({ children }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(CLIPBOARD_STORAGE_KEY);
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CLIPBOARD_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry) => {
    setEntries((prev) => [entry, ...prev].slice(0, 15));
  };

  const value = useMemo(() => ({ entries, addEntry }), [entries]);

  return (
    <ClipboardContext.Provider value={value}>{children}</ClipboardContext.Provider>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function AppLayout({ children }) {
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

function HeroSection() {
  return (
    <section className="hero fade-up">
      <p className="pill">Instant clipboard sharing</p>
      <h1>
        Copy. Paste. <span>Share.</span>
      </h1>
      <p className="hero-sub">
        Share text, images, and files across devices instantly. Your clipboard,
        everywhere.
      </p>
      <div className="hero-actions">
        <a href="#clipboard-box" className="btn btn-primary big">
          Start Pasting
        </a>
        <a href="#features" className="btn btn-outline big">
          Learn More
        </a>
      </div>
      <div className="hero-meta">
        <span>End-to-end encrypted</span>
        <span>Works everywhere</span>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Instant Sharing",
      text: "Paste and get a shareable link in milliseconds.",
    },
    {
      title: "Secure and Private",
      text: "Content auto-expires and stays private.",
    },
    {
      title: "Auto-Expire",
      text: "Set expiry from 1 hour to 30 days.",
    },
    {
      title: "Image Support",
      text: "Drag PNG, JPG, GIF, and WebP images quickly.",
    },
    {
      title: "File Sharing",
      text: "Upload files and share in seconds.",
    },
    {
      title: "Short Links",
      text: "Create compact, easy-to-remember links.",
    },
  ];

  return (
    <section id="features" className="features fade-up delay-1">
      <h2>
        Everything you need in a <span>clipboard</span>
      </h2>
      <p className="section-sub">
        Share text snippets, images, and files with anyone.
      </p>
      <div className="feature-grid">
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <div className="feature-icon">+</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatWhen(dateString) {
  const diffSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}

function ClipboardSection() {
  const { entries, addEntry } = useClipboard();
  const { showToast } = useToast();
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const setIncomingFiles = (incoming) => {
    const next = Array.from(incoming).slice(0, 5);
    setFiles(next);
    if (next.length > 0) {
      showToast("success", `${next.length} file(s) added.`);
    }
  };

  const handleSubmit = () => {
    if (!text.trim() && files.length === 0) {
      showToast("error", "Add text or files first.");
      return;
    }

    const entry = {
      id: Date.now(),
      text: text.trim(),
      files: files.map((file) => ({ name: file.name, size: file.size })),
      createdAt: new Date().toISOString(),
    };

    addEntry(entry);
    setText("");
    setFiles([]);
    showToast("success", "Clipboard item saved.");
  };

  return (
    <section id="clipboard-box" className="clipboard fade-up delay-2">
      <h2>
        Your <span>Clipboard</span>
      </h2>
      <p className="section-sub">Paste text, drop files, or upload images below.</p>
      <div className="composer">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type anything here..."
        />
      </div>

      <label
        className={`dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          setIncomingFiles(event.dataTransfer.files);
        }}
      >
        <input
          type="file"
          multiple
          onChange={(event) => setIncomingFiles(event.target.files)}
        />
        <span>Drop images or files here, or browse</span>
      </label>

      {files.length ? (
        <div className="file-preview">
          {files.map((file) => (
            <div key={`${file.name}-${file.lastModified}`} className="file-chip">
              {file.name}
            </div>
          ))}
        </div>
      ) : null}

      <button className="btn btn-primary send-btn" onClick={handleSubmit}>
        Send
      </button>

      <div className="entry-list">
        {entries.length === 0 ? (
          <div className="empty-state">No clipboard items yet.</div>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="entry">
              <p>{entry.text || "File upload"}</p>
              {entry.files.length ? (
                <small>
                  {entry.files.length} file(s):{" "}
                  {entry.files.map((item) => item.name).join(", ")}
                </small>
              ) : null}
              <time>{formatWhen(entry.createdAt)}</time>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main className="container">
      <HeroSection />
      <FeaturesSection />
      <ClipboardSection />
    </main>
  );
}

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password || (isSignup && !form.name)) {
      showToast("error", "All required fields are needed.");
      return;
    }

    const result = await (isSignup
      ? signup(form.name, form.email, form.password)
      : login(form.email, form.password));

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

function NotFound() {
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClipboardProvider>
          <ToastProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/signup" element={<AuthPage mode="signup" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ToastProvider>
        </ClipboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
