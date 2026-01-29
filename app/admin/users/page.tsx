import { createClient } from '@/utils/supabase/server'
import UserRow from './UserRow'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Filter } from 'lucide-react'

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div>Error loading users</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h2>
            <p className="text-muted-foreground">Manage authorized users and moderation status.</p>
        </div>
        <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input 
                placeholder="Search users by name..." 
                className="pl-9 bg-white dark:bg-slate-900"
            />
        </div>
        <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900">
            <Filter size={16} />
            Filter
        </Button>
      </div>
      
      <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 [&_tr]:border-b">
                <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">User</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400">Joined</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0 bg-white dark:bg-slate-900">
                {users.map((user) => (
                    <UserRow key={user.id} user={user} />
                ))}
            </tbody>
            </table>
        </div>
        {users.length === 0 && (
            <div className="p-8 text-center text-slate-500">No users found.</div>
        )}
      </Card>
    </div>
  )
}
