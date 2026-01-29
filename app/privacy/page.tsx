import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <div className="container mx-auto max-w-3xl px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
            <BrandLogo />
            <h1 className="text-3xl font-bold mt-4">Privacy Policy</h1>
            <p className="text-muted-foreground mt-1">Last Updated: January 29, 2026</p>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none space-y-8">
            
            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">1. Introduction</h2>
                <p>
                    SkillSwap ("we", "us") respects your privacy. This policy explains how we collect, use, and share your data. By using SkillSwap, you consent to the practices described below.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">2. Information We Collect</h2>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>Account Data:</strong> Email address, Password (encrypted), Full Name.</li>
                    <li><strong>Profile Data:</strong> WhatsApp number, Skills you Teach, Skills you Want.</li>
                    <li><strong>Usage Data:</strong> Login timestamps, interaction history with the app.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">3. How We Use Your Data</h2>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li><strong>To Provide the Service:</strong> The core function of SkillSwap is matching. We use your "Teach" and "Learn" data to identify compatible peers.</li>
                    <li><strong>To Connect You:</strong> We display your Name and WhatsApp Number to users who match with you. This is a public disclosure within the app ecosystem.</li>
                    <li><strong>Communication:</strong> To send you updates about your account or new matches.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">4. Data Sharing & Disclosure</h2>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                   <li><strong>With Other Users:</strong> When a match is found, your contact info is visible to that specific user.</li>
                   <li><strong>Service Providers:</strong> We use trusted third parties to run our app:
                        <ul className="list-circle pl-5 mt-2">
                            <li>Supabase: For database hosting and authentication.</li>
                            <li>Vercel: For web hosting.</li>
                        </ul>
                   </li>
                   <li><strong>Legal Compliance:</strong> We may disclose data if required by law enforcement.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">5. Data Storage & Security</h2>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                   <li>We use industry-standard encryption (SSL/TLS) for data in transit.</li>
                   <li>Passwords are salted and hashed via Supabase Auth.</li>
                   <li>While we strive to protect your data, no method of transmission over the Internet is 100% secure.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">6. Your Rights (Kenyan Data Protection Act)</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                   <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
                   <li><strong>Rectify:</strong> Update incorrect information via your dashboard.</li>
                   <li><strong>Delete:</strong> Request the deletion of your account and data.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">7. Cookies</h2>
                <p>
                    We use essential cookies to keep you logged in. We do not use third-party tracking cookies for advertising.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">8. Changes to This Policy</h2>
                <p>
                    We may update this policy occasionally. Continued use of the app after changes constitutes acceptance.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold border-b pb-2 mb-4">9. Contact Us</h2>
                <p>For privacy concerns or to request data deletion, please contact us via the platform.</p>
            </section>

        </div>

        <div className="mt-12 pt-8 border-t text-sm text-muted-foreground text-center">
             &copy; {new Date().getFullYear()} SkillSwap. All rights reserved.
        </div>
      </div>
    </div>
  );
}
