'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Delete a single skill instance (or logically, often we want to delete ALL instances of a skill name, but for now let's support deleting by ID or Name)
// The requirement is "List of all unique skills".
// If we delete a "unique skill", we probably want to delete ALL 'skills' rows with that name.

export async function deleteSkillByName(skillName: string) {
    const supabase = await createClient()
     // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    const { data: adminProfile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!adminProfile?.is_admin) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('skills')
        .delete()
        .eq('skill_name', skillName)

    if (error) throw new Error('Failed to delete skill')
    
    revalidatePath('/admin/skills')
}

export async function mergeSkills(targetName: string, sourceName: string) {
    const supabase = await createClient()
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
     const { data: adminProfile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!adminProfile?.is_admin) throw new Error('Unauthorized')

    // Update all skills with sourceName to have targetName
    const { error } = await supabase
        .from('skills')
        .update({ skill_name: targetName })
        .eq('skill_name', sourceName)

    if (error) throw new Error('Failed to merge skills')

    revalidatePath('/admin/skills')
}
