import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Create profile if it doesn't exist
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const adminSupabase = createAdminClient()
      
      // Check if profile exists
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
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
