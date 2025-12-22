import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { VolumeForm } from '@/components/admin/VolumeForm'

interface EditVolumePageProps {
  params: Promise<{ id: string }>
}

export default async function EditVolumePage({ params }: EditVolumePageProps) {
  if (!(await isAdmin())) {
    redirect('/admin/sign-in')
  }

  const { id } = await params
  const supabase = await createClient()
  
  const { data: volume } = await supabase
    .from('volumes')
    .select('*')
    .eq('id', id)
    .single()

  if (!volume) {
    notFound()
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-bold mb-12 text-charcoal">Edit Volume</h1>
      <VolumeForm volume={volume} />
    </div>
  )
}

