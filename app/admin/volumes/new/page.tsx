import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { VolumeForm } from '@/components/admin/VolumeForm'

export default async function NewVolumePage() {
  if (!(await isAdmin())) {
    redirect('/admin/sign-in')
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-bold mb-12 text-charcoal">New Volume</h1>
      <VolumeForm />
    </div>
  )
}

