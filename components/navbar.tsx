import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.is_admin || false;
  }

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 max-w-5xl mx-auto container justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-8">
          <Link
            href={user ? "/dashboard" : "/"}
            className="hover:opacity-80 transition-opacity"
          >
            <BrandLogo />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/how-it-works" className="hover:text-indigo-600">
              How it Works
            </Link>
            <Link href="/explore" className="hover:text-indigo-600">
              Explore
            </Link>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <ThemeToggle className="mr-2" />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline text-muted-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/setup"
                className="text-sm font-medium hover:underline text-muted-foreground"
              >
                My Profile
              </Link>

              <form action="/auth/signout" method="post">
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </form>
                {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link href="/">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
