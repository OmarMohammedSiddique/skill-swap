import { createClient } from '@/utils/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch some stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalTeach } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('skill_type', 'TEACH')

  const { count: totalLearn } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('skill_type', 'LEARN')

  const { count: totalRequests } = await supabase
    .from('swap_requests')
    .select('*', { count: 'exact', head: true })
    
  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-800 dark:text-white mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Users</p>
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">{totalUsers || 0}</h2>
            </div>
          </div>
        </div>

        {/* Stat Card 2 - Supply (Teach) */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-green-500">
             <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400">
                {/* Book Open Icon */}
               <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Supply (Teaching)</p>
               <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">{totalTeach || 0}</h2>
            </div>
          </div>
        </div>

        {/* Stat Card 3 - Demand (Learn) */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-purple-500">
             <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400">
                {/* Hand Raised or Search Icon */}
               <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Demand (Wanted)</p>
               <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">{totalLearn || 0}</h2>
            </div>
          </div>
        </div>

        {/* Stat Card 4 - Requests */}
         <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-yellow-500">
             <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400">
               <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Swap Requests</p>
               <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">{totalRequests || 0}</h2>
            </div>
          </div>
        </div>
      </div>

        {/* Placeholder for charts */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Growth & Metrics</h3>
        <p className="text-slate-500 dark:text-slate-400">Charts coming soon: New Signups per Day, Orphan Counts.</p>
        <div className="h-64 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mt-4 border border-dashed border-slate-300 dark:border-slate-700 rounded">
            <span className="text-slate-400 dark:text-slate-500">Chart Placeholder</span>
        </div>
      </div>

    </div>
  )
}
