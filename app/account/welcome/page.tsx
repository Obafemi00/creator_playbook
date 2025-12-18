import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function WelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
        Welcome to Creator Playbook
      </h1>
      <p className="text-xl text-charcoal/80 mb-12 max-w-2xl mx-auto">
        You&apos;re all set. Your journey starts now.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/events"
          className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
        >
          Browse events
        </Link>
        <Link
          href="/toolbox"
          className="px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          Explore toolbox
        </Link>
      </div>
    </div>
  )
}

