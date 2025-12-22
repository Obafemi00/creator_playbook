import { createClient } from './supabase/server'

export async function getAdminRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return profile?.role || null
}

export async function isOwner() {
  const role = await getAdminRole()
  return role === 'OWNER'
}

export async function isAdmin() {
  const role = await getAdminRole()
  return role === 'OWNER' || role === 'ADMIN'
}

export async function isMember() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  const { data: membership } = await supabase
    .from('memberships')
    .select('status')
    .eq('user_id', user.id)
    .single()

  return membership?.status === 'active'
}
