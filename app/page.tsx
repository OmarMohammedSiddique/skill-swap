'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async () => {
    setLoading(true)
    // 1. Sign up the user
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert("Signup Error: " + error.message)
    } else {
      // 2. Go straight to dashboard
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      alert("Login Error: " + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-blue-600">
        <CardHeader className="space-y-1">
          {/* v2 TAG TO PROVE IT UPDATED */}
          <CardTitle className="text-2xl font-bold text-center">SkillSwap v2</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button onClick={handleLogin} disabled={loading} className="w-full bg-slate-900">
              {loading ? '...' : 'Log In'}
            </Button>
            <Button onClick={handleSignUp} disabled={loading} variant="outline" className="w-full">
              Sign Up (No Email Needed)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}