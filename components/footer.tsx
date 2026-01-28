import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function Footer() {
    return (
        <footer className="bg-muted text-muted-foreground py-12 border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4">
                            <Link href="/">
                                <BrandLogo />
                            </Link>
                        </div>
                        <p className="max-w-sm">
                            The marketplace where your knowledge is the currency. Teach what you
                            love, learn what you need, and connect with a global community of
                            makers and doers.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/explore" className="hover:text-primary cursor-pointer">
                                    Browse Skills
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-matches" className="hover:text-primary cursor-pointer">
                                    How it Matches
                                </Link>
                            </li>
                            <li className="hover:text-primary cursor-pointer">
                                <Link href="/mission">Pricing (Free!)</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="hover:text-primary cursor-pointer">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary cursor-pointer">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/safety" className="hover:text-primary cursor-pointer">
                                    Safety Guidelines
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; 2026 SkillSwap Inc. All rights reserved.</p>

                </div>
            </div>
        </footer>
    );
}
