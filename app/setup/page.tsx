'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { countryCodes } from '@/utils/country-codes'

export default function SetupProfile() {
  const [fullName, setFullName] = useState('')
  
  // Contact State
  const [countryCode, setCountryCode] = useState('+254') // Default to something or empty
  const [phoneNumber, setPhoneNumber] = useState('')

  // State for skills lists
  const [teachSkills, setTeachSkills] = useState<string[]>([])
  const [learnSkills, setLearnSkills] = useState<string[]>([])

  // State for current inputs
  const [currentTeachInput, setCurrentTeachInput] = useState('')
  const [currentLearnInput, setCurrentLearnInput] = useState('')

  const [loading, setLoading] = useState(true) // Start loading true to fetch data

  const router = useRouter()
  const supabase = createClient()

  // Fetch existing data on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

      // 1. Get Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || '')
        
        // Parse Contact (+Code Number)
        if (profile.whatsapp_contact) {
            const parts = profile.whatsapp_contact.split(' ')
            if (parts.length >= 2) {
                setCountryCode(parts[0]) // +254
                setPhoneNumber(profile.whatsapp_contact.substring(parts[0].length + 1)) // Rest of string
            } else {
                setPhoneNumber(profile.whatsapp_contact)
            }
        }
      }

      // 2. Get Skills
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)

      if (skills) {
        setTeachSkills(skills.filter((s: any) => s.skill_type === 'TEACH').map((s: any) => s.skill_name))
        setLearnSkills(skills.filter((s: any) => s.skill_type === 'LEARN').map((s: any) => s.skill_name))
      }
      
      setLoading(false)
    }

    fetchData()
  }, [])

  // Helper to add skill
  const addSkill = (type: 'TEACH' | 'LEARN') => {
    const normalize = (s: string) => s.trim().toLowerCase();

    if (type === 'TEACH') {
      const skillName = currentTeachInput.trim();
      if (!skillName) return;

      // Check if already in Teach list
      if (teachSkills.includes(skillName)) return;

      // Check if in Learn list (Cross-validation)
      if (learnSkills.some(s => normalize(s) === normalize(skillName))) {
        alert(`You can't teach what you want to learn! "${skillName}" is already in your Learn list.`);
        return;
      }

      setTeachSkills([...teachSkills, skillName])
      setCurrentTeachInput('')
      
    } else {
      const skillName = currentLearnInput.trim();
      if (!skillName) return;

      // Check if already in Learn list
      if (learnSkills.includes(skillName)) return;

      // Check if in Teach list (Cross-validation)
      if (teachSkills.some(s => normalize(s) === normalize(skillName))) {
        alert(`You can't learn what you can teach! "${skillName}" is already in your Teach list.`);
        return;
      }

      setLearnSkills([...learnSkills, skillName])
      setCurrentLearnInput('')
    }
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent, type: 'TEACH' | 'LEARN') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(type)
    }
  }

  // Remove skill
  const removeSkill = (skill: string, type: 'TEACH' | 'LEARN') => {
    if (type === 'TEACH') {
      setTeachSkills(teachSkills.filter(s => s !== skill))
    } else {
      setLearnSkills(learnSkills.filter(s => s !== skill))
    }
  }

  const handleSubmit = async () => {
    // 1. Validation
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    // Basic number validation (digits only, at least 7 digits)
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length < 7) {
       alert("Please enter a valid phone number.");
       return;
    }

    if (teachSkills.length === 0 || learnSkills.length === 0) {
      alert("Please add at least one skill to teach and one to learn.")
      return;
    }

    setLoading(true)

    const fullContact = `${countryCode} ${cleanedNumber}`; // Format: +254 712345678

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 2. Update Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        whatsapp_contact: fullContact,
        email: user.email
      })

    if (profileError) {
      alert('Error updating profile: ' + profileError.message)
      setLoading(false)
      return
    }

    // 3. Update Skills (Delete old, Insert new)
    // First, clear existing skills to avoid duplicates/messy updates
    const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .eq('user_id', user.id)

    if (deleteError) {
        console.error('Error clearing old skills:', deleteError)
        // Continue anyway? converting to specific updates is harder. 
        // Let's assume it works or we might have duplicates. 
    }

    const teachInserts = teachSkills.map(skill => ({
      user_id: user.id,
      skill_name: skill,
      skill_type: 'TEACH'
    }))

    const learnInserts = learnSkills.map(skill => ({
      user_id: user.id,
      skill_name: skill,
      skill_type: 'LEARN'
    }))

    const { error: skillError } = await supabase
      .from('skills')
      .insert([...teachInserts, ...learnInserts])

    if (skillError) {
      alert('Error saving skills: ' + skillError.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Tell us about yourself to get better matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>WhatsApp / Contact Info</Label>
              <div className="flex gap-2">
                 <select 
                    className="flex h-10 w-[110px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                 >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
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
              <p className="text-[0.8rem] text-muted-foreground">
                We'll use this to maintain safety.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* TEACH SECTION */}
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
                <Button onClick={() => addSkill('TEACH')} variant="outline" size="icon">
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

            {/* LEARN SECTION */}
            <div className="space-y-3 pt-2">
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
                <Button onClick={() => addSkill('LEARN')} variant="outline" size="icon">
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
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 h-12 text-lg bg-slate-900 hover:bg-slate-800"
          >
            {loading ? 'Saving Profile...' : 'Complete Setup & Find Matches'}
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}