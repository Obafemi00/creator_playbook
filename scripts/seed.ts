import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seed() {
  console.log('Starting seed...')

  // Seed event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .upsert({
      slug: 'chapter-01-intention',
      chapter_number: 1,
      title: 'INTENTION',
      one_line_promise: 'Start with clarity. Build with purpose.',
      description: 'This is the first chapter in the Creator Playbook journey. We explore how to set intentions that actually stick, how to build systems that support your goals, and how to move forward when you feel stuck.',
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual video
      is_free_preview: true,
      status: 'published',
      idea_content: `The idea behind intention is simple: before you build anything, you need to know why you're building it.

Not the surface-level why. The deep why. The one that gets you out of bed on the hard days. The one that keeps you going when things get tough.`,
      strategy_content: `The strategy for setting intentions that stick:

1. Write it down. Not in a note app. On paper. With a pen.
2. Make it specific. "Build a better product" isn't an intention. "Launch version 1.0 by March" is.
3. Connect it to a feeling. What does success feel like? Visualize that.
4. Review it weekly. Not daily. Weekly. Give yourself space to reflect.`,
      action_content: `Your one clear action this week:

Pick one thing you've been putting off. Write down why you want to do it. Then, write down one small step you can take today. Do that step.`,
      published_at: new Date().toISOString(),
    }, {
      onConflict: 'slug',
    })
    .select()
    .single()

  if (eventError) {
    console.error('Error seeding event:', eventError)
  } else {
    console.log('✅ Seeded event:', event.slug)
  }

  // Seed tools
  const tools = [
    {
      slug: 'intention-setting-template',
      name: 'Intention Setting Template',
      description: 'A simple template to help you set and track intentions that actually stick.',
      gated_level: 'email' as const,
      type: 'download' as const,
      status: 'published' as const,
    },
    {
      slug: 'weekly-review-template',
      name: 'Weekly Review Template',
      description: 'A framework for reviewing your progress and adjusting your course each week.',
      gated_level: 'member' as const,
      type: 'download' as const,
      status: 'published' as const,
    },
    {
      slug: 'creator-resources',
      name: 'Creator Resources',
      description: 'Curated list of tools and resources for creators building with intention.',
      gated_level: 'email' as const,
      type: 'link' as const,
      tool_config: { url: 'https://example.com/resources' },
      status: 'published' as const,
    },
  ]

  for (const tool of tools) {
    const { data, error } = await supabase
      .from('tools')
      .upsert(tool, {
        onConflict: 'slug',
      })
      .select()
      .single()

    if (error) {
      console.error(`Error seeding tool ${tool.slug}:`, error)
    } else {
      console.log(`✅ Seeded tool: ${data.slug}`)
    }
  }

  console.log('Seed complete!')
}

seed().catch(console.error)

