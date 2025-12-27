import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin/dashboard routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || 
                       request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isPublicRoute = request.nextUrl.pathname === '/' || 
                        request.nextUrl.pathname.startsWith('/events') ||
                        request.nextUrl.pathname.startsWith('/playbook') ||
                        request.nextUrl.pathname.startsWith('/about') ||
                        request.nextUrl.pathname.startsWith('/pricing') ||
                        request.nextUrl.pathname.startsWith('/terms') ||
                        request.nextUrl.pathname.startsWith('/privacy')

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute && !request.nextUrl.pathname.startsWith('/auth/reset-password')) {
    // Check if admin
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
    if (adminProfile) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Protect admin/dashboard routes
  if (isAdminRoute && !isAuthRoute) {
    if (!user) {
      const redirectUrl = request.nextUrl.pathname.startsWith('/dashboard') 
        ? '/auth/login' 
        : '/admin/sign-in'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Check admin status
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminProfile) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirect unauthenticated users from protected account routes
  if (!user && request.nextUrl.pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
