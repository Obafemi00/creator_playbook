import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Handle volume purchases
    if (session.metadata?.volume_id && session.customer_email) {
      await supabase.from('purchases').insert({
        volume_id: session.metadata.volume_id,
        email: session.customer_email,
        stripe_session_id: session.id,
        paid: session.payment_status === 'paid',
      })
    }

    // Handle playbook purchases (for downloads)
    // This includes both direct purchases and support payments (which also unlock downloads)
    if (session.payment_status === 'paid') {
      const isPlaybookPurchase = session.metadata?.type === 'playbook_purchase'
      const isSupportPayment = session.metadata?.product === 'playbook' && session.metadata?.support_amount

      if (isPlaybookPurchase || isSupportPayment) {
        try {
          const buyerEmail = 
            session.customer_details?.email ||
            session.customer_email ||
            session.metadata?.email ||
            session.metadata?.buyer_email ||
            null

          // Get current month if not in metadata
          const now = new Date()
          const playbookMonth = session.metadata?.playbook_month || 
            session.metadata?.month ||
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

          if (buyerEmail) {
            // Idempotent upsert: if stripe_session_id exists, skip (webhook may fire multiple times)
            const { data: existing } = await supabase
              .from('playbook_purchases')
              .select('id')
              .eq('stripe_session_id', session.id)
              .single()

            if (!existing) {
              const { error: insertError } = await supabase
                .from('playbook_purchases')
                .insert({
                  email: buyerEmail,
                  stripe_session_id: session.id,
                  stripe_payment_intent_id: session.payment_intent as string || null,
                  amount: session.amount_total || 0,
                  currency: session.currency || 'usd',
                  playbook_month: playbookMonth,
                  status: 'paid',
                })

              if (insertError) {
                console.error('Error inserting playbook purchase:', insertError)
              }
            }
          } else {
            console.error('Missing email in playbook purchase/support webhook')
          }
        } catch (error) {
          console.error('Error processing playbook purchase webhook:', error)
        }
      }
    }

    // Handle playbook support payments
    if (session.metadata?.product === 'playbook' && session.metadata?.support_amount) {
      try {
        // Get buyer email from Stripe session (preferred source)
        const buyerEmail = 
          session.customer_details?.email || 
          session.customer_email || 
          session.metadata.buyer_email || 
          null

        const userId = session.metadata.user_id || null
        const amount = parseInt(session.metadata.support_amount, 10) * 100 // Convert to cents
        const status = session.payment_status === 'paid' ? 'completed' : 'pending'

        // Check if support record already exists (from pending creation)
        const supportId = session.metadata.support_id || null

        if (supportId) {
          // Update existing pending record
          const { error: updateError } = await supabase
            .from('playbook_supports')
            .update({
              status,
              buyer_email: buyerEmail,
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string || null,
              amount: session.amount_total || amount,
              currency: session.currency || 'usd',
            })
            .eq('id', supportId)

          if (updateError) {
            console.error('Error updating playbook support:', updateError)
          }
        } else {
          // Insert new record if pending wasn't created
          const { error: insertError } = await supabase.from('playbook_supports').insert({
            user_id: userId || null,
            amount: session.amount_total || amount,
            currency: session.currency || 'usd',
            status,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string || null,
            buyer_email: buyerEmail,
            month: session.metadata.month || null,
            product: 'playbook',
          })

          if (insertError) {
            console.error('Error inserting playbook support:', insertError)
          }
        }
      } catch (error) {
        console.error('Error processing playbook support webhook:', error)
      }
    }
  }

  // Handle payment_intent.succeeded for additional verification
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    // Update support record if it exists
    if (paymentIntent.metadata?.product === 'playbook') {
      try {
        const { error } = await supabase
          .from('playbook_supports')
          .update({
            status: 'completed',
            stripe_payment_intent_id: paymentIntent.id,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .or(`stripe_checkout_session_id.is.null,stripe_payment_intent_id.eq.${paymentIntent.id}`)

        if (error) {
          console.error('Error updating playbook support from payment_intent:', error)
        }
      } catch (error) {
        console.error('Error processing payment_intent webhook:', error)
      }
    }
  }

  return NextResponse.json({ received: true })
}
