'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface EventFormProps {
  event?: {
    id: string
    chapter_number: number
    title: string
    slug: string
    one_line_promise: string
    description: string | null
    youtube_url: string | null
    is_free_preview: boolean
    status: string
    idea_content: string | null
    strategy_content: string | null
    action_content: string | null
    thumbnail_path: string | null
  }
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    chapter_number: event?.chapter_number || 1,
    title: event?.title || '',
    slug: event?.slug || '',
    one_line_promise: event?.one_line_promise || '',
    description: event?.description || '',
    youtube_url: event?.youtube_url || '',
    is_free_preview: event?.is_free_preview || false,
    status: event?.status || 'draft',
    idea_content: event?.idea_content || '',
    strategy_content: event?.strategy_content || '',
    action_content: event?.action_content || '',
  })
  const [thumbnail, setThumbnail] = useState<File | null>(null)

  useEffect(() => {
    if (!event && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let thumbnailPath = event?.thumbnail_path || null

      // Upload thumbnail if provided
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cp-assets')
          .upload(`events/${fileName}`, thumbnail)

        if (uploadError) throw uploadError
        thumbnailPath = uploadData.path
      }

      const eventData = {
        ...formData,
        thumbnail_path: thumbnailPath,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      }

      if (event) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('events').insert(eventData)
        if (error) throw error
      }

      router.push('/admin/events')
      router.refresh()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Chapter number</label>
          <input
            type="number"
            value={formData.chapter_number}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chapter_number: parseInt(e.target.value) || 1,
              }))
            }
            required
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">One-line promise</label>
        <input
          type="text"
          value={formData.one_line_promise}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, one_line_promise: e.target.value }))
          }
          required
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">YouTube URL</label>
        <input
          type="url"
          value={formData.youtube_url}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, youtube_url: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">The idea</label>
        <textarea
          value={formData.idea_content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, idea_content: e.target.value }))
          }
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">The strategy</label>
        <textarea
          value={formData.strategy_content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, strategy_content: e.target.value }))
          }
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">One clear action</label>
        <textarea
          value={formData.action_content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, action_content: e.target.value }))
          }
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_free_preview}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, is_free_preview: e.target.checked }))
            }
            className="w-5 h-5 rounded border-charcoal/20"
          />
          <span className="text-sm font-semibold">Free preview</span>
        </label>
        <label className="flex items-center gap-2">
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-4 py-2 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-transparent border-2 border-charcoal text-charcoal rounded-full font-semibold hover:bg-charcoal hover:text-offwhite transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

