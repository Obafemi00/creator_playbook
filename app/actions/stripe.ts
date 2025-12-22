'use server'

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

interface CreateCheckoutParams {
  volumeId: string
  email: string
}

export async function createCheckoutSession({ volumeId, email }: CreateCheckoutParams) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  // Get volume details
  const { data: volume } = await adminSupabase
    .from('volumes')
    .select('*')
    .eq('id', volumeId)
    .eq('status', 'published')
    .single()

  if (!volume) {
    throw new Error('Volume not found')
  }

  // Check if already purchased
  const { data: existingPurchase } = await adminSupabase
    .from('purchases')
    .select('id')
    .eq('volume_id', volumeId)
    .eq('email', email)
    .single()

  if (existingPurchase) {
    redirect(`/events/${volume.slug}?purchased=true`)
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: volume.title,
            description: volume.one_line_promise,
          },
          unit_amount: volume.price_cents,
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${volume.slug}?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${volume.slug}`,
    metadata: {
      volume_id: volumeId,
      email,
    },
  })

  return { url: session.url }
}

export async function createMembershipCheckoutSession(priceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: user?.email || undefined,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      type: 'membership',
    },
  })

  return { url: session.url }
}

export async function createPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!membership?.stripe_customer_id) {
    throw new Error('No Stripe customer ID found')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: membership.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
  })

  return { url: session.url }
}
