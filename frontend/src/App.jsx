import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ClipboardProvider } from "./context/ClipboardContext";
import { ToastProvider } from "./context/ToastContext";

// Layout & Pages
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";

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

