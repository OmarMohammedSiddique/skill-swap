import { createClient } from '@/utils/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  ShieldAlert, 
  UserX,
  History
} from 'lucide-react'

export default async function ModerationPage() {
  const supabase = await createClient()

  // 1. Fetch Users with Warnings (> 0)
  const { data: flaggedUsers } = await supabase
    .from('profiles')
    .select('*')
    .gt('warning_count', 0)
    .order('warning_count', { ascending: false })

  // 2. Fetch Recent Logs
  const { data: recentLogs } = await supabase
    .from('moderation_logs')
    .select(`
        *,
        profiles ( full_name, email )
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Moderation Dashboard</h2>
        <p className="text-muted-foreground dark:text-slate-400">Review flagged content and user warning levels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FLAGGED USERS */}
        <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="text-orange-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Warned Users</h3>
            </div>
            {flaggedUsers?.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900">
                    No users have warnings yet. Good job community!
                </Card>
            ) : (
                <div className="space-y-3">
                    {flaggedUsers?.map(user => (
                        <Card key={user.id} className="p-4 flex justify-between items-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <div>
                                <div className="font-bold text-slate-900 dark:text-slate-100">{user.full_name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                                    {user.warning_count} Warnings
                                </Badge>
                                {user.warning_count > 2 && (
                                     <Badge variant="destructive">High Risk</Badge>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>

        {/* RECENT LOGS */}
        <div className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <History className="text-indigo-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Recent Incidents</h3>
            </div>
             <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentLogs?.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-slate-900 dark:text-slate-200 text-sm">
                                    {log.profiles?.full_name || 'Unknown User'}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(log.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 italic">
                                "{log.content}"
                            </div>
                            <div className="mt-2 flex gap-2">
                                <Badge variant="secondary" className="text-xs py-0 h-5 bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    Triggered: {log.detected_words}
                                </Badge>
                            </div>
                        </div>
                    ))}
                    {recentLogs?.length === 0 && (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No moderation logs found.
                        </div>
                    )}
                </div>
             </Card>
        </div>

      </div>
    </div>
  )
}
