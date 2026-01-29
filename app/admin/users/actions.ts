'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBanUser(userId: string, currentStatus: boolean) {
    const supabase = await createClient()

    // Auth check: Ensure caller is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
         throw new Error('Unauthorized')
    }
    const { data: adminProfile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!adminProfile?.is_admin) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentStatus })
        .eq('id', userId)

    if (error) {
        throw new Error('Failed to update ban status')
    }

    revalidatePath('/admin/users')
}

export async function toggleVerifyUser(userId: string, currentStatus: boolean) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
         throw new Error('Unauthorized')
    }
    const { data: adminProfile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!adminProfile?.is_admin) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('id', userId)

    if (error) {
        throw new Error('Failed to verify user')
    }

    revalidatePath('/admin/users')
}
