import { createClient } from './supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function isAdmin() {
  const profile = await getUserProfile()
  return profile?.role === 'admin'
}

export async function isMember() {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return false

  const { data: membership } = await supabase
    .from('memberships')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  return !!membership
}

