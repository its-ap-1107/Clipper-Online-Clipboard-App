import { useState } from "react";
import { useClipboard } from "../context/ClipboardContext";
import { useToast } from "../context/ToastContext";

function formatWhen(dateString) {
    const diffSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diffSeconds < 60) return "just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
}

export function ClipboardSection() {
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
