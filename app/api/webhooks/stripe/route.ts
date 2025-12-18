import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id

      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        await supabase.from('memberships').upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status === 'active' ? 'active' : 'inactive',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          price_id: subscription.items.data[0].price.id,
        })

        // Update profile role to member
        await supabase
          .from('profiles')
          .update({ role: 'member' })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: membership } = await supabase
        .from('memberships')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (membership) {
        await supabase
          .from('memberships')
          .update({
            status: subscription.status === 'active' ? 'active' : 'inactive',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            price_id: subscription.items.data[0].price.id,
          })
          .eq('user_id', membership.user_id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: membership } = await supabase
        .from('memberships')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (membership) {
        await supabase
          .from('memberships')
          .update({
            status: 'canceled',
          })
          .eq('user_id', membership.user_id)

        // Revert profile role to public
        await supabase
          .from('profiles')
          .update({ role: 'public' })
          .eq('id', membership.user_id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

