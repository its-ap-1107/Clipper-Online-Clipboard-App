import { createContext, useContext, useMemo, useState } from "react";

export const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
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
