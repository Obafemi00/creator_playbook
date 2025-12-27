import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Ensure this route is not statically generated
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/playbook/download?session_id=...
 * Secure download endpoint - verifies payment before serving PDF
 * Server-side verification only - never trust client
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Valid session_id is required' },
        { status: 401 }
      )
    }

    // Get current month in YYYY-MM format
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const supabase = createAdminClient()

    // Verify purchase exists and is paid
    const { data: purchase, error } = await supabase
      .from('playbook_purchases')
      .select('id, status, download_count')
      .eq('stripe_session_id', sessionId)
      .eq('playbook_month', currentMonth)
      .eq('status', 'paid')
      .single()

    if (error || !purchase) {
      return NextResponse.json(
        { error: 'Purchase not found or not paid' },
        { status: 401 }
      )
    }

    // Increment download count and update last_downloaded_at
    await supabase
      .from('playbook_purchases')
      .update({
        download_count: purchase.download_count + 1,
        last_downloaded_at: new Date().toISOString(),
      })
      .eq('id', purchase.id)

    // Serve PDF from public directory
    const pdfPath = join(process.cwd(), 'public', 'docs', 'Creator Playbook Website.pdf')
    
    try {
      const fileBuffer = await readFile(pdfPath)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Creator Playbook Website.pdf"',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    } catch (fileError) {
      console.error('Error reading PDF file:', fileError)
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error in download endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
