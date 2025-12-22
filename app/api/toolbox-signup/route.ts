import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert toolbox signup (will fail silently if duplicate due to unique constraint)
    await supabase
      .from('toolbox_signups')
      .insert({ email })
      .select()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Toolbox signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

