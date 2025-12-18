import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ToolForm } from '@/components/admin/ToolForm'

export default async function NewToolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">New Tool</h1>
      <ToolForm />
    </div>
  )
}

