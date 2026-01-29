"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft } from "lucide-react";
import { countryCodes } from "@/utils/country-codes";
import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile State
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("+254");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Skills State
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [currentTeachInput, setCurrentTeachInput] = useState("");
  const [currentLearnInput, setCurrentLearnInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Helper to add skill
  const addSkill = (type: "TEACH" | "LEARN") => {
    const normalize = (s: string) => s.trim().toLowerCase();

    if (type === "TEACH") {
      const skillName = currentTeachInput.trim();
      if (!skillName) return;
      if (teachSkills.includes(skillName)) return;
      if (learnSkills.some((s) => normalize(s) === normalize(skillName))) {
        alert(
          `You can't teach what you want to learn! "${skillName}" is already in your Learn list.`
        );
        return;
      }
      setTeachSkills([...teachSkills, skillName]);
      setCurrentTeachInput("");
    } else {
      const skillName = currentLearnInput.trim();
      if (!skillName) return;
      if (learnSkills.includes(skillName)) return;
      if (teachSkills.some((s) => normalize(s) === normalize(skillName))) {
        alert(
          `You can't learn what you can teach! "${skillName}" is already in your Teach list.`
        );
        return;
      }
      setLearnSkills([...learnSkills, skillName]);
      setCurrentLearnInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: "TEACH" | "LEARN") => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(type);
    }
  };

  const removeSkill = (skill: string, type: "TEACH" | "LEARN") => {
    if (type === "TEACH") {
      setTeachSkills(teachSkills.filter((s) => s !== skill));
    } else {
      setLearnSkills(learnSkills.filter((s) => s !== skill));
    }
  };

  const handleSignup = async () => {
    // 1. Validation
    if (!email || !password || !fullName || !country || !phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!agreed) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (teachSkills.length === 0 || learnSkills.length === 0) {
      alert("Please add at least one skill to teach and one to learn.");
      return;
    }

    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedNumber.length < 7) {
      alert("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    // 2. Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert("Signup Error: " + authError.message);
      setLoading(false);
      return;
    }

    const user = authData.user;
    if (!user) {
        // Should not happen if no error, but safety check
        alert("Something went wrong during signup. Please try again.");
        setLoading(false);
        return;
    }

    // 3. Create Profile
    const fullContact = `${countryCode} ${cleanedNumber}`;
    
    // Slight delay to ensure trigger/auth propagation if needed, 
    // but typically we can write immediately if implicit rows aren't an issue.
    // upsert is safe.
    
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        whatsapp_contact: fullContact,
        email: email,
        country: country,
      });

    if (profileError) {
      alert("Account created but profile update failed: " + profileError.message);
      setLoading(false);
      return;
    }

    // 4. Add Skills
    const teachInserts = teachSkills.map((skill) => ({
      user_id: user.id,
      skill_name: skill,
      skill_type: "TEACH",
    }));

    const learnInserts = learnSkills.map((skill) => ({
      user_id: user.id,
      skill_name: skill,
      skill_type: "LEARN",
    }));

    const { error: skillError } = await supabase
      .from("skills")
      .insert([...teachInserts, ...learnInserts]);

    if (skillError) {
       alert("Account created but skills save failed: " + skillError.message);
    } else {
       // Success!
       router.push("/dashboard");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link href="/" className="flex justify-center mb-6">
          <BrandLogo />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-foreground">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Join the community and start swapping skills today.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <Card className="bg-card shadow-xl border-border">
          <CardContent className="p-8 space-y-8">
            
            {/* --- Account Details --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b pb-2">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
              </div>
            </div>

            {/* --- Profile & Contact --- */}
            <div className="space-y-4">
               <h3 className="text-lg font-medium text-foreground border-b pb-2">Location & Contact</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label>Country of Residence</Label>
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="" disabled>Select your country</option>
                        {countryCodes.map((c) => (
                          <option key={c.country} value={c.country}>
                            {c.flag} {c.country}
                          </option>
                        ))}
                      </select>
                   </div>
                   
                   <div className="space-y-2">
                      <Label>WhatsApp / Phone</Label>
                      <div className="flex gap-2">
                         <select 
                            className="flex h-10 w-[110px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                         >
                            {countryCodes.map((c) => (
                              <option key={c.country} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                         </select>
                         <Input 
                            type="tel"
                            placeholder="712 345 678" 
                            value={phoneNumber} 
                            onChange={e => setPhoneNumber(e.target.value)} 
                            className="flex-1"
                         />
                      </div>
                   </div>
               </div>
            </div>

            {/* --- Skills --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground border-b pb-2">Skills</h3>
                
                {/* TEACH */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-indigo-600 flex items-center gap-2">
                    I can TEACH (Add multiple)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Guitar, Python, Baking"
                      value={currentTeachInput}
                      onChange={e => setCurrentTeachInput(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, 'TEACH')}
                    />
                    <Button onClick={() => addSkill('TEACH')} variant="outline" size="icon" type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {teachSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer ml-1"
                          onClick={() => removeSkill(skill, 'TEACH')}
                        />
                      </Badge>
                    ))}
                    {teachSkills.length === 0 && (
                      <span className="text-sm text-muted-foreground italic">No skills added yet</span>
                    )}
                  </div>
                </div>

                {/* LEARN */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-emerald-600 flex items-center gap-2">
                    I want to LEARN (Add multiple)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. French, Machine Learning, Piano"
                      value={currentLearnInput}
                      onChange={e => setCurrentLearnInput(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, 'LEARN')}
                    />
                    <Button onClick={() => addSkill('LEARN')} variant="outline" size="icon" type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {learnSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer ml-1"
                          onClick={() => removeSkill(skill, 'LEARN')}
                        />
                      </Badge>
                    ))}
                     {learnSkills.length === 0 && (
                      <span className="text-sm text-muted-foreground italic">No skills added yet</span>
                    )}
                  </div>
                </div>
            </div>

            <div className="flex items-center space-x-2 mt-6">
                <Input 
                    type="checkbox" 
                    id="terms" 
                    className="h-4 w-4 bg-background border-input rounded" 
                    checked={agreed} 
                    onChange={e => setAgreed(e.target.checked)} 
                    style={{ width: 'auto', margin: 0 }}
                />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the <span onClick={() => setShowTerms(true)} className="text-indigo-600 underline cursor-pointer">Terms of Service</span> and <span onClick={() => setShowPrivacy(true)} className="text-indigo-600 underline cursor-pointer">Privacy Policy</span>.
                </Label>
            </div>

            <Button 
                onClick={handleSignup} 
                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 mt-4"
                disabled={loading}
            >
                {loading ? "Creating Account..." : "Create Account & Profile"}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link href="/?login=true" className="text-indigo-600 hover:underline font-medium">
                    Sign in here
                </Link>
            </p>

          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
             <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back to Home
            </Link>
        </div>
      </div>

    {/* Terms Modal */}
    {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center bg-muted/50">
                    <h3 className="text-xl font-bold">Terms of Service</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowTerms(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-6 overflow-y-auto prose dark:prose-invert max-w-none text-sm leading-relaxed flex-1">
                    <p><strong>Last Updated: January 29, 2026</strong></p>
                    
                    <h4>1. Acceptance of Terms</h4>
                    <p>By accessing or using SkillSwap ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, you must cease using the Platform immediately.</p>

                    <h4>2. Nature of Service</h4>
                    <p>SkillSwap is a facilitator that connects users ("Learners") with other users ("Teachers") for the purpose of skill exchange.</p>
                    <ul>
                        <li><strong>We are a Connector Only:</strong> SkillSwap is not an educational institution. We do not employ teachers, nor do we verify the accuracy, safety, or quality of the skills taught.</li>
                        <li><strong>No Vetting:</strong> We do not conduct background checks on users. You engage with other users at your own risk.</li>
                    </ul>

                    <h4>3. User Eligibility</h4>
                    <p>You must be at least 18 years old to use this Platform. If you are using this Platform on behalf of an organization (e.g., a student club), you warrant that you have the authority to bind that organization.</p>

                    <h4>4. User Conduct & Safety</h4>
                    <p>You agree NOT to:</p>
                    <ul>
                        <li>Post false, misleading, or fraudulent content.</li>
                        <li>Offer or request skills that are illegal, dangerous, or violate academic integrity (e.g., writing exams for others).</li>
                        <li>Harass, stalk, or harm another user.</li>
                        <li>Scrape, reverse engineer, or attack the Platform's infrastructure.</li>
                    </ul>

                    <h4>5. Off-Platform Interactions (The "WhatsApp" Clause)</h4>
                    <p>SkillSwap facilitates connections that may move to third-party platforms (e.g., WhatsApp, Zoom, physical meetups).</p>
                    <ul>
                        <li><strong>Release of Liability:</strong> SkillSwap has no control over and no liability for interactions, disputes, or damages that occur off our Platform.</li>
                        <li><strong>Personal Safety:</strong> You are solely responsible for your safety during meetups or calls. We recommend meeting in public places (e.g., University Library) and protecting sensitive personal information.</li>
                    </ul>

                    <h4>6. Intellectual Property</h4>
                    <ul>
                        <li><strong>Your Content:</strong> You retain ownership of the profile data you submit. You grant SkillSwap a license to display this data to other users for matching purposes.</li>
                        <li><strong>Our Content:</strong> The code, design, and "SkillSwap" brand are owned by us.</li>
                    </ul>

                    <h4>7. Disclaimers ("As Is")</h4>
                    <p>THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS for a particular purpose, and non-infringement. We do not guarantee that matches will be compatible or successful.</p>

                    <h4>8. Limitation of Liability</h4>
                    <p>TO THE FULLEST EXTENT PERMITTED BY LAW, SKILLSWAP AND ITS CREATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF DATA, PERSONAL INJURY, OR PROPERTY DAMAGE RESULTING FROM YOUR USE OF THE SERVICE.</p>

                    <h4>9. Indemnification</h4>
                    <p>You agree to indemnify and hold harmless SkillSwap from any claims, damages, or expenses arising from your violation of these Terms or your violation of the rights of any third party (including other users).</p>

                    <h4>10. Termination</h4>
                    <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users.</p>

                    <h4>11. Governing Law</h4>
                    <p>These Terms shall be governed by the laws of Kenya. Any disputes arising shall be resolved in the competent courts of Nairobi.</p>
                </div>
                <div className="p-4 border-t bg-muted/50 flex justify-end">
                    <Button onClick={() => setShowTerms(false)}>I have read the Terms</Button>
                </div>
            </Card>
        </div>
    )}

    {/* Privacy Modal */}
    {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center bg-muted/50">
                    <h3 className="text-xl font-bold">Privacy Policy</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowPrivacy(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-6 overflow-y-auto prose dark:prose-invert max-w-none text-sm leading-relaxed flex-1">
                    <p><strong>Last Updated: January 29, 2026</strong></p>

                    <h4>1. Introduction</h4>
                    <p>SkillSwap ("we", "us") respects your privacy. This policy explains how we collect, use, and share your data. By using SkillSwap, you consent to the practices described below.</p>

                    <h4>2. Information We Collect</h4>
                    <ul>
                        <li><strong>Account Data:</strong> Email address, Password (encrypted), Full Name.</li>
                        <li><strong>Profile Data:</strong> WhatsApp number, Skills you Teach, Skills you Want.</li>
                        <li><strong>Usage Data:</strong> Login timestamps, interaction history with the app.</li>
                    </ul>

                    <h4>3. How We Use Your Data</h4>
                    <ul>
                        <li><strong>To Provide the Service:</strong> The core function of SkillSwap is matching. We use your "Teach" and "Learn" data to identify compatible peers.</li>
                        <li><strong>To Connect You:</strong> We display your Name and WhatsApp Number to users who match with you. This is a public disclosure within the app ecosystem.</li>
                        <li><strong>Communication:</strong> To send you updates about your account or new matches.</li>
                    </ul>

                    <h4>4. Data Sharing & Disclosure</h4>
                    <ul>
                        <li><strong>With Other Users:</strong> When a match is found, your contact info is visible to that specific user.</li>
                        <li><strong>Service Providers:</strong> We use trusted third parties to run our app (Supabase, Vercel).</li>
                        <li><strong>Legal Compliance:</strong> We may disclose data if required by law enforcement.</li>
                    </ul>

                    <h4>5. Data Storage & Security</h4>
                    <ul>
                        <li>We use industry-standard encryption (SSL/TLS) for data in transit.</li>
                        <li>Passwords are salted and hashed via Supabase Auth.</li>
                        <li>While we strive to protect your data, no method of transmission over the Internet is 100% secure.</li>
                    </ul>

                    <h4>6. Your Rights (Kenyan Data Protection Act)</h4>
                    <p>You have the right to access, rectify, or request deletion of your account and data.</p>

                    <h4>7. Cookies</h4>
                    <p>We use essential cookies to keep you logged in. We do not use third-party tracking cookies for advertising.</p>

                    <h4>8. Changes to This Policy</h4>
                    <p>We may update this policy occasionally. Continued use of the app after changes constitutes acceptance.</p>

                    <h4>9. Contact Us</h4>
                    <p>For privacy concerns or to request data deletion, please contact us via the platform.</p>
                </div>
                <div className="p-4 border-t bg-muted/50 flex justify-end">
                    <Button onClick={() => setShowPrivacy(false)}>I have read the Policy</Button>
                </div>
            </Card>
        </div>
    )}

    </div>
  );
}
