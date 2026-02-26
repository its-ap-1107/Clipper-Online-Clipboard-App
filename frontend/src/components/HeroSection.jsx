export function HeroSection() {
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
