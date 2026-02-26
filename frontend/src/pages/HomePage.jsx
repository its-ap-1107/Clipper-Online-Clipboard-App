import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { ClipboardSection } from "../components/ClipboardSection";

export function HomePage() {
    return (
        <main className="container">
            <HeroSection />
            <FeaturesSection />
            <ClipboardSection />
        </main>
    );
}
