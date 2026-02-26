import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CLIPBOARD_STORAGE_KEY = "clipper_entries";

export const ClipboardContext = createContext(null);

export function useClipboard() {
    return useContext(ClipboardContext);
}

export function ClipboardProvider({ children }) {
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
