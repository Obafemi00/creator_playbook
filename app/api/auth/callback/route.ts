import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  const type = requestUrl.searchParams.get('type') // 'magiclink' or 'recovery'

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Called from Server Component - middleware will handle
            }
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
    }

    if (user) {
      const adminSupabase = createAdminClient()
      
      // Create profile if it doesn't exist
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        await adminSupabase.from('profiles').insert({
          id: user.id,
          email: user.email || '',
        })
      }

      // Check if user is admin and redirect accordingly
      const { data: adminProfile } = await adminSupabase
        .from('admin_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (adminProfile) {
        // Admin user - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Regular user - redirect based on context
      if (type === 'recovery') {
        // Password reset - redirect to reset password page
        return NextResponse.redirect(new URL('/auth/reset-password', request.url))
      }

      // Default redirect for regular users
      const redirectTo = next !== '/' ? next : '/account'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL(next, request.url))
}
