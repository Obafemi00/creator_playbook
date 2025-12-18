import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ToolForm } from '@/components/admin/ToolForm'

interface EditToolPageProps {
  params: Promise<{ id: string }>
}

export default async function EditToolPage({ params }: EditToolPageProps) {
  const { id } = await params
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

  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single()

  if (!tool) {
    notFound()
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">Edit Tool</h1>
      <ToolForm tool={tool} />
    </div>
  )
}

