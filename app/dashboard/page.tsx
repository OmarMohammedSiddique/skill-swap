import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/')

  // Get My Skills
  const { data: mySkills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)

  const iWantToLearn = mySkills?.find(s => s.skill_type === 'LEARN')?.skill_name || ''
  const iCanTeach = mySkills?.find(s => s.skill_type === 'TEACH')?.skill_name || ''

  // Find Matches
  const { data: potentialTeachers } = await supabase
    .from('skills')
    .select(`
      user_id,
      skill_name,
      profiles ( full_name, whatsapp_contact )
    `)
    .eq('skill_type', 'TEACH')
    .ilike('skill_name', iWantToLearn)
    .neq('user_id', user.id)

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header Section with Sign Out */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">SkillSwap Board</h1>
          <p className="text-slate-500 mt-2">
            You want to learn <span className="font-bold text-blue-600">{iWantToLearn}</span> 
            {' '}and you teach <span className="font-bold text-green-600">{iCanTeach}</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="/setup" className="text-sm text-slate-500 hover:text-slate-900 underline">
            Edit skills
          </a>
          <form action="/auth/signout" method="post">
            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Available Teachers for you</h2>
        
        {(!potentialTeachers || potentialTeachers.length === 0) && (
            <div className="p-12 text-center border-2 border-dashed rounded-lg bg-white/50">
                <p className="text-muted-foreground">
                    No one is teaching <strong>{iWantToLearn}</strong> yet. 
                </p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {potentialTeachers?.map((match: any) => (
            <Card key={match.user_id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{match.profiles?.full_name || 'Anonymous User'}</CardTitle>
                    <Badge variant="secondary">Teacher</Badge>
                </div>
                <CardDescription>
                    Can teach you <span className="font-bold text-blue-600">{match.skill_name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-3 rounded-md border border-green-100 flex flex-col gap-2">
                  <div>
                    <p className="text-xs font-bold text-green-800 uppercase mb-1">Contact Info</p>
                    <p className="text-sm font-medium text-green-900">
                      {match.profiles?.whatsapp_contact || 'No contact info provided'}
                    </p>
                  </div>
                  {match.profiles?.whatsapp_contact && (
                    <a 
                      href={`https://wa.me/${match.profiles.whatsapp_contact.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-center bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-4 rounded-md font-bold transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}