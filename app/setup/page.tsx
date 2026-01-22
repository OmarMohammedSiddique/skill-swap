'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function SetupProfile() {
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [teachSkill, setTeachSkill] = useState('')
  const [learnSkill, setLearnSkill] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
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
    // We insert two rows: one for TEACH, one for LEARN
    const { error: skillError } = await supabase
      .from('skills')
      .insert([
        { user_id: user.id, skill_name: teachSkill, skill_type: 'TEACH' },
        { user_id: user.id, skill_name: learnSkill, skill_type: 'LEARN' }
      ])

    if (skillError) {
      alert('Error saving skills: ' + skillError.message)
    } else {
      router.push('/dashboard') // Go to dashboard after setup
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>WhatsApp / Contact Info</Label>
            <Input placeholder="+254 7..." value={contact} onChange={e => setContact(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Label className="text-green-600 font-bold">I can TEACH:</Label>
              <Input placeholder="e.g. Python" value={teachSkill} onChange={e => setTeachSkill(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-600 font-bold">I want to LEARN:</Label>
              <Input placeholder="e.g. React" value={learnSkill} onChange={e => setLearnSkill(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full mt-6">
            {loading ? 'Saving...' : 'Find Matches'}
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}