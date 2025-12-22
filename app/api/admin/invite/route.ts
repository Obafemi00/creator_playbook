import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isOwner } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    if (!(await isOwner())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { email, role } = await req.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const adminSupabase = createAdminClient()
    const { data: user } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. They need to sign up first.' },
        { status: 404 }
      )
    }

    // Create admin profile
    const { error } = await adminSupabase
      .from('admin_profiles')
      .upsert({
        user_id: user.id,
        role,
      })

    if (error) {
      console.error('Error creating admin profile:', error)
      return NextResponse.json(
        { error: 'Failed to create admin profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin invite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

