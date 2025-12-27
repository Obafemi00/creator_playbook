import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/purchases/status?session_id=... OR ?email=...
 * Returns purchase status for a given Stripe session ID or email
 * Server-side only - uses service role to bypass RLS
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    const email = searchParams.get('email')

    // Get current month in YYYY-MM format
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const supabase = createAdminClient()

    let purchase

    if (sessionId && typeof sessionId === 'string' && sessionId.startsWith('cs_')) {
      // Query by session_id (preferred for immediate verification)
      const { data, error } = await supabase
        .from('playbook_purchases')
        .select('email, status, playbook_month, stripe_session_id')
        .eq('stripe_session_id', sessionId)
        .eq('playbook_month', currentMonth)
        .single()

      if (error || !data) {
        return NextResponse.json({ paid: false, status: null, email: null, session_id: null })
      }

      purchase = data
    } else if (email && typeof email === 'string') {
      // Query by email (for returning users)
      const { data, error } = await supabase
        .from('playbook_purchases')
        .select('email, status, playbook_month, stripe_session_id')
        .eq('email', email)
        .eq('playbook_month', currentMonth)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return NextResponse.json({ paid: false, status: null, email: null, session_id: null })
      }

      purchase = data
    } else {
      return NextResponse.json(
        { error: 'session_id or email is required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      paid: purchase.status === 'paid',
      status: purchase.status,
      email: purchase.email,
      session_id: purchase.stripe_session_id,
    })
  } catch (error) {
    console.error('Error checking purchase status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
