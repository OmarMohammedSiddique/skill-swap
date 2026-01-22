'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

export default function Home() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This redirects them back to your site after clicking the email link
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      alert(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">SkillSwap</CardTitle>
          <CardDescription>Enter your email to start swapping skills.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-green-600 text-center font-medium">
              Check your email! We sent you a magic link.
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input 
                type="email" 
                placeholder="strathmore@edu.ke" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Send Magic Link
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}