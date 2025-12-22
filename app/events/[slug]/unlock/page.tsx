import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { UnlockForm } from '@/components/UnlockForm'
import { Section } from '@/components/Section'

interface UnlockPageProps {
  params: Promise<{ slug: string }>
}

export default async function UnlockPage({ params }: UnlockPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: volume } = await supabase
    .from('volumes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!volume || !volume.pdf_path) {
    notFound()
  }

  return (
    <div className="relative">
      <Section className="pt-32">
        <UnlockForm volume={volume} />
      </Section>
    </div>
  )
}

