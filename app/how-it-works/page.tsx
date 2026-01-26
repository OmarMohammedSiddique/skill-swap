import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Search, Handshake, Star } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: <UserPlus className="h-10 w-10 text-indigo-600" />,
            title: "Create Your Profile",
            description:
                "Sign up and list the skills you can teach and the skills you want to learn. Be detailed to attract the right matches!",
        },
        {
            icon: <Search className="h-10 w-10 text-indigo-600" />,
            title: "Find a Match",
            description:
                "Browse through other users' profiles or let our algorithm suggest potential swap partners based on mutual interests.",
        },
        {
            icon: <Handshake className="h-10 w-10 text-indigo-600" />,
            title: "Connect & Swap",
            description:
                "Message your match, set up a time, and start swapping skills! It's all about mutual growth and community.",
        },
        {
            icon: <Star className="h-10 w-10 text-indigo-600" />,
            title: "Rate & Review",
            description:
                "After your session, leave a review to build trust in the community and help others find great teachers.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 bg-slate-50">
                    <div className="container px-4 mx-auto text-center max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                            How <span className="text-indigo-600">SkillSwap</span> Works
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                            SkillSwap is a community-driven platform where you can trade your expertise for new skills. No money changes hands—just knowledge.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/">
                                <Button size="lg" className="gap-2">
                                    Get Started <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-20">
                    <div className="container px-4 mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="mb-6 p-4 bg-indigo-50 rounded-full">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section (Optional/Simple) */}
                <section className="py-20 bg-slate-50">
                    <div className="container px-4 mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Ready to start learning?</h2>
                        <Link href="/">
                            <Button size="lg" variant="default">Join the Community</Button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
