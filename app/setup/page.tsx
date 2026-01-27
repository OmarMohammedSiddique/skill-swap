'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

export default function SetupProfile() {
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')

  // State for skills lists
  const [teachSkills, setTeachSkills] = useState<string[]>([])
  const [learnSkills, setLearnSkills] = useState<string[]>([])

  // State for current inputs
  const [currentTeachInput, setCurrentTeachInput] = useState('')
  const [currentLearnInput, setCurrentLearnInput] = useState('')

  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Helper to add skill
  const addSkill = (type: 'TEACH' | 'LEARN') => {
    if (type === 'TEACH') {
      if (currentTeachInput.trim() && !teachSkills.includes(currentTeachInput.trim())) {
        setTeachSkills([...teachSkills, currentTeachInput.trim()])
        setCurrentTeachInput('')
      }
    } else {
      if (currentLearnInput.trim() && !learnSkills.includes(currentLearnInput.trim())) {
        setLearnSkills([...learnSkills, currentLearnInput.trim()])
        setCurrentLearnInput('')
      }
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
    if (teachSkills.length === 0 || learnSkills.length === 0) {
      alert("Please add at least one skill to teach and one to learn.")
      return;
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Update Profile (Name & Contact)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        whatsapp_contact: contact,
        email: user.email
      })

    if (profileError) {
      alert('Error updating profile: ' + profileError.message)
      setLoading(false)
      return
    }

    // 2. Add Skills
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
              <Input placeholder="+254 7..." value={contact} onChange={e => setContact(e.target.value)} />
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