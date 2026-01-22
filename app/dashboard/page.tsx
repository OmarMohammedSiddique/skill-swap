import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // We need to add this component next!

export default async function Dashboard() {
  const supabase = await createClient()

  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/')

  // 2. Get My Skills (What I Teach & What I Learn)
  const { data: mySkills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)

  const iWantToLearn = mySkills?.find(s => s.skill_type === 'LEARN')?.skill_name || ''
  const iCanTeach = mySkills?.find(s => s.skill_type === 'TEACH')?.skill_name || ''

  // 3. Find Matches
  // We look for skills where type is 'TEACH' AND name matches what I want to learn
  const { data: potentialTeachers } = await supabase
    .from('skills')
    .select(`
      user_id,
      skill_name,
      profiles ( full_name, whatsapp_contact )
    `)
    .eq('skill_type', 'TEACH')
    .ilike('skill_name', iWantToLearn) // Case-insensitive match
    .neq('user_id', user.id) // Don't match with myself

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">SkillSwap Board</h1>
          <p className="text-slate-500 mt-2">
            You want to learn <span className="font-bold text-blue-600">{iWantToLearn}</span> 
            {' '}and you teach <span className="font-bold text-green-600">{iCanTeach}</span>.
          </p>
        </div>
        <a href="/setup" className="text-sm text-slate-400 hover:text-slate-900 underline">
          Edit my skills
        </a>
      </div>

      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Available Teachers for you</h2>
        
        {/* If no matches found */}
        {(!potentialTeachers || potentialTeachers.length === 0) && (
            <div className="p-12 text-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                    No one is teaching <strong>{iWantToLearn}</strong> yet. 
                    <br/>Maybe try searching for something popular like "Python" or "Cooking"?
                </p>
            </div>
        )}

        {/* The Match Cards */}
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
                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                  <p className="text-xs font-bold text-green-800 uppercase mb-1">Contact Info</p>
                  <p className="text-sm font-medium text-green-900">
                    {match.profiles?.whatsapp_contact || 'No contact info provided'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}