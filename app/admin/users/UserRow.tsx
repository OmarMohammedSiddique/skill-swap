'use client'

import { toggleBanUser, toggleVerifyUser } from './actions'
import { useState } from 'react'
import { Check, ShieldBan, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function UserRow({ user }: { user: any }) {
    const [isPending, setIsPending] = useState(false)

    const handleBanToggle = async () => {
        setIsPending(true)
        try {
            await toggleBanUser(user.id, user.is_banned)
        } catch (error) {
            alert('Error updating user status')
        }
        setIsPending(false)
    }

    const handleVerifyToggle = async () => {
        setIsPending(true)
        try {
             await toggleVerifyUser(user.id, user.is_verified)
        } catch (error) {
             alert('Error updating verification status')
        }
        setIsPending(false)
    }

    return (
        <tr className="border-b transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50 last:border-0 border-slate-200 dark:border-slate-800">
            <td className="p-4 align-middle">
                <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{user.full_name || 'No Name'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                </div>
            </td>
            <td className="p-4 align-middle text-slate-600 dark:text-slate-300">
               {user.is_admin ? 'Admin' : 'User'}
            </td>
            <td className="p-4 align-middle">
                <Badge variant={user.is_banned ? "destructive" : "default"} className={!user.is_banned ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200" : ""}>
                    {user.is_banned ? 'Banned' : 'Active'}
                </Badge>
                {user.is_verified && (
                    <Badge variant="outline" className="ml-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20">
                        Verified
                    </Badge>
                )}
            </td>
            <td className="p-4 align-middle text-slate-500 dark:text-slate-400 text-sm">
                {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td className="p-4 align-middle text-right">
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        title={user.is_verified ? "Unverify User" : "Verify User"}
                        onClick={handleVerifyToggle}
                        disabled={isPending}
                        className={user.is_verified ? "text-indigo-600 dark:text-indigo-400 hover:max-w-fit hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" : "text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"}
                    >
                        <ShieldCheck size={18} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        title={user.is_banned ? "Unban User" : "Ban User"}
                        onClick={handleBanToggle}
                        disabled={isPending}
                        className={user.is_banned ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30" : "text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"}
                    >
                        {user.is_banned ? <Check size={18}/> : <ShieldBan size={18} />}
                    </Button>
                </div>
            </td>
        </tr>
    )
}
