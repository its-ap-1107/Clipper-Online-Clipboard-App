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

export function FeaturesSection() {
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
