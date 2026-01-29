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

            <Button 
                onClick={handleSignup} 
                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 mt-6"
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
    </div>
  );
}
