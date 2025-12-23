'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FadeIn } from '@/components/motion'

interface VolumeFormProps {
  volume?: {
    id: string
    title: string
    slug: string
    event_date: string
    one_line_promise: string
    description: string | null
    youtube_url: string | null
    status: string
    price_cents: number
    pdf_path: string | null
  }
}

export function VolumeForm({ volume }: VolumeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: volume?.title || '',
    slug: volume?.slug || '',
    event_date: volume?.event_date || '',
    one_line_promise: volume?.one_line_promise || '',
    description: volume?.description || '',
    youtube_url: volume?.youtube_url || '',
    status: volume?.status || 'draft',
    price_cents: volume?.price_cents || 100,
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  useEffect(() => {
    if (!volume && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, volume])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let pdfPath = volume?.pdf_path || null

      // Upload PDF if provided
      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop()
        const fileName = `${formData.slug || 'volume'}-${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('creator-playbook-pdfs')
          .upload(fileName, pdfFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError
        pdfPath = fileName
      }

      const volumeData = {
        ...formData,
        pdf_path: pdfPath,
      }

      if (volume) {
        const { error } = await supabase
          .from('volumes')
          .update(volumeData)
          .eq('id', volume.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('volumes').insert(volumeData)
        if (error) throw error
      }

      router.push('/admin/volumes')
      router.refresh()
    } catch (error) {
      console.error('Error saving volume:', error)
      alert('Failed to save volume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FadeIn>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-charcoal">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-charcoal">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-charcoal">Event Date</label>
          <input
            type="date"
            value={formData.event_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, event_date: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-charcoal">One-line Promise</label>
          <input
            type="text"
            value={formData.one_line_promise}
            onChange={(e) => setFormData((prev) => ({ ...prev, one_line_promise: e.target.value }))}
            required
            className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-charcoal">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-charcoal">YouTube URL</label>
          <input
            type="url"
            value={formData.youtube_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, youtube_url: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-charcoal">File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
          {volume?.pdf_path && !pdfFile && (
            <p className="text-sm text-charcoal/60 mt-2">Current: {volume.pdf_path}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-charcoal">Price (cents)</label>
            <input
              type="number"
              value={formData.price_cents}
              onChange={(e) => setFormData((prev) => ({ ...prev, price_cents: parseInt(e.target.value) || 100 }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-charcoal">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-orange text-offwhite rounded-full font-medium hover:bg-orange/90 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : volume ? 'Update Volume' : 'Create Volume'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-medium hover:bg-charcoal hover:text-offwhite transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </FadeIn>
  )
}

