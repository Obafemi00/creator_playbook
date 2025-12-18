import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/toolbox/ToolDetail'
import { isMember } from '@/lib/auth'

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!tool) {
    notFound()
  }

  const member = await isMember()
  const { data: { user } } = await supabase.auth.getUser()
  let hasEmailAccess = false

  if (user && tool.gated_level === 'email') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    if (profile?.email) {
      const { data: unlock } = await supabase
        .from('email_unlocks')
        .select('*')
        .eq('tool_id', tool.id)
        .eq('email', profile.email)
        .single()

      hasEmailAccess = !!unlock
    }
  }

  const canAccess = tool.gated_level === 'email' ? hasEmailAccess : member

  return <ToolDetail tool={tool} canAccess={canAccess} requiresEmail={tool.gated_level === 'email' && !hasEmailAccess && !member} />
}

