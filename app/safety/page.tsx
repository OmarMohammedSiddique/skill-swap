import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function SafetyGuidelines() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/50">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-extrabold text-foreground mb-8">Safety Guidelines</h1>

                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                    <p className="mb-6">
                        Your safety is our top priority. We've compiled these guidelines to help you have a safe and positive
                        experience on SkillSwap.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Keep it on the Platform</h2>
                    <p className="mb-4">
                        For your first few interactions, we recommend keeping communication within our secure messaging system.
                        Do not share personal phone numbers or addresses until you feel comfortable.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Meeting in Person</h2>
                    <p className="mb-4">
                        If you decide to meet for an in-person skill swap:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                        <li>Meet in a public place like a café or library.</li>
                        <li>Tell a friend or family member where you are going and when you expect to return.</li>
                        <li>Trust your instincts. If something feels off, you can leave at any time.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Video Calls</h2>
                    <p className="mb-4">
                        For online swaps, ensure you are in a neutral environment. Be mindful of what is visible in your background.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Reporting Issues</h2>
                    <p className="mb-6">
                        If you encounter any inappropriate behavior, harassment, or suspicious activity, please report it to us
                        immediately using the report feature or by emailing safety@skillswap.com.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
