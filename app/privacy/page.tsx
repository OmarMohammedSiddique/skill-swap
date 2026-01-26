import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/50">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-extrabold text-foreground mb-8">Privacy Policy</h1>

                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                    <p className="mb-6">
                        At SkillSwap, we value your privacy and are committed to protecting your personal information.
                        This Privacy Policy explains how we collect, use, and share your data when you use our platform.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">
                        We collect information you provide directly to us, such as when you create an account, update your profile,
                        or communicate with other users. This may include your name, email address, skills, and learning interests.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use your information to:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Facilitate skill swaps and matches.</li>
                        <li>Improve and personalize our platform.</li>
                        <li>Communicate with you about updates and security alerts.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Data Security</h2>
                    <p className="mb-4">
                        We implement reasonable security measures to protect your data. However, no method of transmission over the
                        internet is 100% secure.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Contact Us</h2>
                    <p className="mb-6">
                        If you have any questions about this Privacy Policy, please contact us at support@skillswap.com.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
