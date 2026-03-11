import { useState } from "react";
import { useClipboard } from "../context/ClipboardContext";
import { useToast } from "../context/ToastContext";

function formatWhen(dateString) {
    if (!dateString) return '';
    const diffSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diffSeconds < 60) return "just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
}

export function ClipboardSection() {
    // We can keep useClipboard to store historical uploaded entries locally
    const { entries, addEntry } = useClipboard();
    const { showToast } = useToast();

    const [text, setText] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [retrievalCode, setRetrievalCode] = useState("");
    const [retrievedClip, setRetrievedClip] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!text.trim()) {
            showToast("error", "Add text first.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("clipper_token");
            const headers = { "Content-Type": "application/json" };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch("/api/clips", {
                method: "POST",
                headers,
                body: JSON.stringify({ content: text.trim() }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create clip");

            showToast("success", "Clip created!");
            setGeneratedCode(data.clip.code);
            addEntry(data.clip);
            setText("");
        } catch (err) {
            showToast("error", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRetrieve = async () => {
        if (!retrievalCode.trim() || retrievalCode.length !== 4) {
            showToast("error", "Enter a valid 4-digit code.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/clips/${retrievalCode.trim()}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Clip not found");

            setRetrievedClip(data.clip);
            showToast("success", "Clip retrieved!");
        } catch (err) {
            showToast("error", err.message);
            setRetrievedClip(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="clipboard-box" className="clipboard fade-up delay-2">
            <h2>
                Your <span>Clipboard</span>
            </h2>
            <p className="section-sub">Paste text to share, or retrieve an existing clip using a 4-digit code.</p>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                {/* Upload Section */}
                <div style={{ flex: "1 1 300px" }}>
                    <h3>Create Clip</h3>
                    <div className="composer">
                        <textarea
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            placeholder="Paste or type anything here to share..."
                        />
                    </div>
                    {generatedCode && (
                        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "8px" }}>
                            <strong>Success! Your share code is: </strong>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)" }}>{generatedCode}</span>
                        </div>
                    )}
                    <button
                        className="btn btn-primary send-btn"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Create Share Code"}
                    </button>
                </div>

                {/* Retrieve Section */}
                <div style={{ flex: "1 1 300px" }}>
                    <h3>Retrieve Clip</h3>
                    <div className="composer" style={{ minHeight: "auto", padding: "1rem" }}>
                        <input
                            type="text"
                            maxLength={4}
                            value={retrievalCode}
                            onChange={(e) => setRetrievalCode(e.target.value)}
                            placeholder="Enter 4-digit code"
                            style={{ padding: "0.5rem", fontSize: "1.2rem", width: "100%", letterSpacing: "2px", textAlign: "center" }}
                        />
                    </div>
                    <button
                        className="btn btn-outline send-btn"
                        onClick={handleRetrieve}
                        disabled={loading}
                        style={{ marginTop: "1rem", width: "100%" }}
                    >
                        {loading ? "Searching..." : "Retrieve Clip"}
                    </button>

                    {retrievedClip && (
                        <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "8px" }}>
                            <h4>Retrieved Content ({formatWhen(retrievedClip.createdAt)}):</h4>
                            <p style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>{retrievedClip.content}</p>
                        </div>
                    )}
                </div>
            </div>

            <h3 style={{ marginTop: "3rem", marginBottom: "1rem" }}>Your Recent Clips</h3>
            <div className="entry-list">
                {entries.length === 0 ? (
                    <div className="empty-state">No clipboard items yet.</div>
                ) : (
                    entries.map((entry) => (
                        <article key={entry.id} className="entry">
                            <p style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>{entry.content}</span>
                                <strong style={{ color: "var(--primary)" }}>Code: {entry.code}</strong>
                            </p>
                            <time>{formatWhen(entry.createdAt || entry.expiresAt)}</time>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}
