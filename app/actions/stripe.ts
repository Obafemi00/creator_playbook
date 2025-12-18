'use server'

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Get or create customer
  const adminSupabase = createAdminClient()
  let { data: membership } = await adminSupabase
    .from('memberships')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = membership?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        user_id: user.id,
      },
    })
    customerId = customer.id

    await adminSupabase.from('memberships').upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      user_id: user.id,
    },
  })

  return { url: session.url }
}

export async function createPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const adminSupabase = createAdminClient()
  const { data: membership } = await adminSupabase
    .from('memberships')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!membership?.stripe_customer_id) {
    throw new Error('No customer found')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: membership.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
  })

  return { url: session.url }
}

