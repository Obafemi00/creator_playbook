import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

/**
 * Creates a Stripe Checkout Session for Playbook purchase
 * POST /api/stripe/checkout
 * Body: { email: string, amount: number } where amount is 100, 200, or 300 (cents)
 */
export async function POST(req: NextRequest) {
  try {
    const { email, amount } = await req.json()

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (![100, 200, 300].includes(amount)) {
      return NextResponse.json(
        { error: 'Amount must be 100, 200, or 300 cents' },
        { status: 400 }
      )
    }

    // Get current month in YYYY-MM format
    const now = new Date()
    const playbookMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Creator Playbook',
              description: `Monthly Playbook - ${playbookMonth}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL}/playbook?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL}/playbook?canceled=1`,
      metadata: {
        playbook_month: playbookMonth,
        email,
        type: 'playbook_purchase',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
