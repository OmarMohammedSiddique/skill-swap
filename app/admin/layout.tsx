import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Users, 
  Code, 
  BarChart3, 
  ShieldAlert, 
  LogOut,
  LayoutDashboard
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/')
  }

  // Double check admin status on server side rending of layout
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ShieldAlert size={24} />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Admin Portal</h2>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Overview
          </div>
          
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <div className="mt-6 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Management
          </div>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Users size={18} />
            User Management
          </Link>
          
          <Link
            href="/admin/skills"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Code size={18} />
            Content Moderation
          </Link>

          <Link
            href="/admin/moderation"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ShieldAlert size={18} />
            User Moderation
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
           <div className="px-3 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Theme</span>
              <ThemeToggle />
           </div>
           
           <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950">
        {/* Mobile Header */}
        <header className="flex justify-between items-center p-4 shadow-sm bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 md:hidden">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <ShieldAlert size={20} />
                <span className="font-bold text-lg text-slate-900 dark:text-white">Admin</span>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300">Back</Link>
            </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
