import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-5xl mx-auto container justify-between">
        {/* Logo / Brand */}
        <Link href={user ? "/dashboard" : "/"} className="font-bold text-xl tracking-tight">
          SkillSwap <span className="text-blue-600">v2</span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:underline text-slate-600">
                Dashboard
              </Link>
              <Link href="/setup" className="text-sm font-medium hover:underline text-slate-600">
                My Profile
              </Link>
              
              <form action="/auth/signout" method="post">
                <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}