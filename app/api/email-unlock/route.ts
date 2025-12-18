import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, toolId } = await req.json()

    if (!email || !toolId) {
      return NextResponse.json(
        { error: 'Email and toolId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create email unlock record
    const { error } = await supabase
      .from('email_unlocks')
      .insert({
        email,
        tool_id: toolId,
      })

    if (error) {
      // Ignore duplicate key errors (already unlocked)
      if (error.code !== '23505') {
        console.error('Error creating email unlock:', error)
        return NextResponse.json(
          { error: 'Failed to unlock' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email unlock error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

