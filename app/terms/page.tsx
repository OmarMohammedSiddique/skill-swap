import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <div className="container mx-auto max-w-3xl px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
            <BrandLogo />
            <h1 className="text-3xl font-bold mt-4">Terms of Service (Agreement)</h1>
            <p className="text-muted-foreground mt-1">Last Updated: January 29, 2026</p>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none space-y-8">
            
            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using SkillSwap ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, you must cease using the Platform immediately.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">2. Nature of Service</h2>
                <p>
                    SkillSwap is a facilitator that connects users ("Learners") with other users ("Teachers") for the purpose of skill exchange.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>We are a Connector Only:</strong> SkillSwap is not an educational institution. We do not employ teachers, nor do we verify the accuracy, safety, or quality of the skills taught.</li>
                    <li><strong>No Vetting:</strong> We do not conduct background checks on users. You engage with other users at your own risk.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">3. User Eligibility</h2>
                <p>
                    You must be at least 18 years old to use this Platform. If you are using this Platform on behalf of an organization (e.g., a student club), you warrant that you have the authority to bind that organization.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">4. User Conduct & Safety</h2>
                <p>You agree NOT to:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Post false, misleading, or fraudulent content.</li>
                    <li>Offer or request skills that are illegal, dangerous, or violate academic integrity (e.g., writing exams for others).</li>
                    <li>Harass, stalk, or harm another user.</li>
                    <li>Scrape, reverse engineer, or attack the Platform's infrastructure.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">5. Off-Platform Interactions (The "WhatsApp" Clause)</h2>
                <p>
                    SkillSwap facilitates connections that may move to third-party platforms (e.g., WhatsApp, Zoom, physical meetups).
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>Release of Liability:</strong> SkillSwap has no control over and no liability for interactions, disputes, or damages that occur off our Platform.</li>
                    <li><strong>Personal Safety:</strong> You are solely responsible for your safety during meetups or calls. We recommend meeting in public places (e.g., University Library) and protecting sensitive personal information.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">6. Intellectual Property</h2>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>Your Content:</strong> You retain ownership of the profile data you submit. You grant SkillSwap a license to display this data to other users for matching purposes.</li>
                    <li><strong>Our Content:</strong> The code, design, and "SkillSwap" brand are owned by us.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">7. Disclaimers ("As Is")</h2>
                <p className="uppercase">
                    THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS for a particular purpose, and non-infringement. We do not guarantee that matches will be compatible or successful.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">8. Limitation of Liability</h2>
                <p className="uppercase">
                    TO THE FULLEST EXTENT PERMITTED BY LAW, SKILLSWAP AND ITS CREATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF DATA, PERSONAL INJURY, OR PROPERTY DAMAGE RESULTING FROM YOUR USE OF THE SERVICE.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">9. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless SkillSwap from any claims, damages, or expenses arising from your violation of these Terms or your violation of the rights of any third party (including other users).
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">10. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">11. Governing Law</h2>
                <p>
                    These Terms shall be governed by the laws of Kenya. Any disputes arising shall be resolved in the competent courts of Nairobi.
                </p>
            </section>

        </div>
        
        <div className="mt-12 pt-8 border-t text-sm text-muted-foreground text-center">
             &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
        </div>
      </div>
    </div>
  );
}
