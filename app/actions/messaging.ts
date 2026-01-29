'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const BANNED_WORDS = [
    'badword', 'curse', 'offensive', 'spam', 'sh*t', 'f*ck', 'damn' // Add real list as needed
]

export type SendMessageResult = 
    | { status: 'success', data: any }
    | { status: 'blocked', message: string, warningCount: number }
    | { status: 'error', message: string }

export async function sendMessage(content: string, receiverId: string): Promise<SendMessageResult> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { status: 'error', message: 'Unauthorized' }

    // 1. Check Profanity
    const lowerContent = content.toLowerCase()
    const foundBadWords = BANNED_WORDS.filter(word => lowerContent.includes(word))

    if (foundBadWords.length > 0) {
        // --- MODERATION TRIGGERED ---
        
        // A. Log the incident
        await supabase.from('moderation_logs').insert({
            user_id: user.id,
            content: content,
            detected_words: foundBadWords.join(', ')
        })

        // B. Increment Warning Count
        // First get current
        const { data: profile } = await supabase.from('profiles').select('warning_count').eq('id', user.id).single()
        const newCount = (profile?.warning_count || 0) + 1
        
        await supabase.from('profiles').update({ warning_count: newCount }).eq('id', user.id)

        // Return blocked status
        return { 
            status: 'blocked', 
            message: 'Message blocked due to inappropriate language.', 
            warningCount: newCount 
        }
    }

    // 2. Send Message (Clean)
    const { data, error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        content: content
    })

    if (error) {
        console.error('Send error:', error)
        return { status: 'error', message: 'Failed to send' }
    }

    return { status: 'success', data }
}
