import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Create Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Get User
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Admin Route Protection & Banned User Check
  if (user) {
    // Fetch profile to check flags
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, is_banned')
      .eq('id', user.id)
      .single()

    // Banned User Guard
    if (profile?.is_banned) {
        // Build the URL for the "banned" page
        const url = request.nextUrl.clone()
        url.pathname = '/banned'
        
        // Avoid infinite redirect loop if already on /banned
        if (request.nextUrl.pathname !== '/banned') {
             return NextResponse.redirect(url)
        }
    }

    // Admin Route Guard
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!profile?.is_admin) {
        // Redirect non-admins to dashboard
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  } else {
    // Not logged in
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Redirect unauthenticated users trying to access admin to login
        // Redirect unauthenticated users trying to access admin to login (home)
        const url = request.nextUrl.clone()
        url.pathname = '/' // Redirect to home since we use modal/home login
        return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
