import { createClient } from '@/utils/supabase/server'
import SkillsClient from './SkillsClient'

export default async function SkillsPage() {
  const supabase = await createClient()

  // Fetch all skills
  const { data: skillsData, error } = await supabase
    .from('skills')
    .select('skill_name')

  if (error) {
    return <div>Error loading skills</div>
  }

  // Get unique skill names
  const uniqueSkills = Array.from(new Set(skillsData.map(s => s.skill_name))).sort()

  return (
    <div className="space-y-6">
       <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Content Moderation Queue</h2>
            <p className="text-muted-foreground dark:text-slate-400">Standardize user-submitted skills and maintain database quality.</p>
        </div>
        
      <SkillsClient skills={uniqueSkills} />
    </div>
  )
}
