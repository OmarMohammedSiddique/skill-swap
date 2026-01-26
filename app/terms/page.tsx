import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsOfService() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/50">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-extrabold text-foreground mb-8">Terms of Service</h1>

                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                    <p className="mb-6">
                        Welcome to SkillSwap. By accessing or using our platform, you agree to be bound by these Terms of Service.
                        Please read them carefully.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By registering for and/or using the Service in any manner, you agree to these Terms of Service and all other operating
                        rules, policies, and procedures that may be published from time to time on the Site by us.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. User Conduct</h2>
                    <p className="mb-4">
                        You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, impairs,
                        or renders the Service less efficient. You are solely responsible for your interactions with other users.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Skill Swapping</h2>
                    <p className="mb-4">
                        SkillSwap facilitates the exchange of knowledge. We do not guarantee the quality of instruction or the
                        outcome of any skill swap.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
                    <p className="mb-6">
                        IN NO EVENT SHALL SKILLSWAP BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                        EXEMPLARY DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
