import { createClient } from '@/lib/supabase/server'
import { ToolCard } from '@/components/ToolCard'

export default async function ToolboxPage() {
  const supabase = await createClient()
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Creator Toolbox
        </h1>
        <p className="text-lg text-charcoal/80">
          Simple tools designed to help creators think clearer and move faster. Zero fluff. One job per tool.
        </p>
      </div>
      {tools && tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-center text-charcoal/60 py-12">No tools yet.</p>
      )}
    </div>
  )
}

