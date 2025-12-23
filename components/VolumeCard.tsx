'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './Button'
import { FadeIn } from './motion'

interface VolumeCardProps {
  volume: {
    id: string
    slug: string
    title: string
    one_line_promise: string
    youtube_url: string | null
    pdf_path: string | null
    price_cents: number
    event_date: string
  }
}

export function VolumeCard({ volume }: VolumeCardProps) {
  const [hasPurchased, setHasPurchased] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkPurchase()
  }, [])

  const checkPurchase = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Check localStorage for email-based purchases
      const email = localStorage.getItem('purchase_email')
      if (email) {
        const { data } = await supabase
          .from('purchases')
          .select('id')
          .eq('volume_id', volume.id)
          .eq('email', email)
          .single()
        setHasPurchased(!!data)
      }
      setChecking(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    if (profile?.email) {
      const { data } = await supabase
        .from('purchases')
        .select('id')
        .eq('volume_id', volume.id)
        .eq('email', profile.email)
        .single()
      setHasPurchased(!!data)
    }
    setChecking(false)
  }

  const handleDownload = async () => {
    if (!volume.pdf_path) return
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let email = user?.email || localStorage.getItem('purchase_email')
    if (!email) return

    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('volume_id', volume.id)
      .eq('email', email)
      .single()

    if (!purchase) return

    // Get signed URL
    const { data: signedUrl } = await supabase.storage
      .from('creator-playbook-pdfs')
      .createSignedUrl(volume.pdf_path, 3600)

    if (signedUrl?.signedUrl) {
      window.open(signedUrl.signedUrl, '_blank')
    }
  }

  return (
    <FadeIn>
      <div 
        id={volume.slug}
        className="bg-white/40 backdrop-blur-sm rounded-3xl p-10 md:p-12 border border-charcoal/5 hover:border-orange/20 transition-all duration-300"
      >
        <div className="mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-charcoal">
            {volume.title}
          </h2>
          <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
            {volume.one_line_promise}
          </p>
          {volume.event_date && (
            <p className="text-sm text-charcoal/50">
              {new Date(volume.event_date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}
        </div>

        {volume.youtube_url && (
          <div className="aspect-video mb-8 rounded-2xl overflow-hidden bg-charcoal/5">
            <iframe
              src={`https://www.youtube.com/embed/${volume.youtube_url.split('v=')[1]?.split('&')[0] || volume.youtube_url}`}
              title={volume.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {volume.pdf_path && (
            <>
              {hasPurchased ? (
                <Button onClick={handleDownload} variant="primary">
                  Download
                </Button>
              ) : (
                <Button href={`/events/${volume.slug}/unlock`} variant="primary">
                  Unlock (${(volume.price_cents / 100).toFixed(2)})
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </FadeIn>
  )
}

