import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Handshake, Target, Clock, Globe, ShieldCheck, Zap } from "lucide-react";

export default function HowItMatches() {
    const features = [
        {
            icon: <Target className="h-10 w-10 text-indigo-600" />,
            title: "Smart Skill Pairing",
            description:
                "Our algorithm analyzes your 'Teach' and 'Learn' lists to find the perfect counterpart. If you want to learn Guitar and can teach Coding, we find someone who can teach Guitar and wants to learn Coding.",
        },
        {
            icon: <Clock className="h-10 w-10 text-indigo-600" />,
            title: "Availability Matching",
            description:
                "Time is precious. We cross-reference your available hours with your matches to ensure you can actually schedule sessions without endless back-and-forth.",
        },
        {
            icon: <Globe className="h-10 w-10 text-indigo-600" />,
            title: "Location Preference",
            description:
                "Whether you prefer face-to-face meetups in your local coffee shop or virtual sessions from the comfort of your home, we filter matches based on your location preferences.",
        },
        {
            icon: <ShieldCheck className="h-10 w-10 text-indigo-600" />,
            title: "Trust & Safety Score",
            description:
                "We prioritize members with verified profiles and positive community feedback. Our underlying trust score helps surface the most reliable learning partners.",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 bg-secondary/30">
                    <div className="container mx-auto px-4 text-center max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            The Science of <span className="text-indigo-600">Perfect Matches</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            We go beyond simple keyword matching. Our intelligent system connects you with the people who are most likely to help you succeed.
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex gap-6 p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="shrink-0 bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl h-fit">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="border-t border-border py-20 bg-secondary/10">
                    <div className="container mx-auto px-4 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                                <Zap className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h2 className="text-3xl font-bold">Ready to find your match?</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                Join thousands of others who are trading skills and building connections today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Link href="/explore">
                                    <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-700">
                                        Browse Skills
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
