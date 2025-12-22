import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isOwner } from '@/lib/auth'
import { AdminManagement } from '@/components/admin/AdminManagement'

export default async function AdminAdminsPage() {
  if (!(await isOwner())) {
    redirect('/admin')
  }

  return <AdminManagement />
}

