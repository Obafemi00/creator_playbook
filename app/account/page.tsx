import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountContent } from '@/components/account/AccountContent'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return <AccountContent user={user} membership={membership} />
}

