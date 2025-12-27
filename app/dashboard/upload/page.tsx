import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { UploadPlaybookForm } from '@/components/admin/UploadPlaybookForm'

export default async function UploadPlaybookPage() {
  if (!(await isAdmin())) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f12] via-[#1a1a1f] to-[#0f0f12] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#f2f2f2] mb-12">
          Upload New Playbook
        </h1>
        <UploadPlaybookForm />
      </div>
    </div>
  )
}
