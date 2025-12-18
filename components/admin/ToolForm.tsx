'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ToolFormProps {
  tool?: {
    id: string
    name: string
    slug: string
    description: string
    gated_level: 'email' | 'member'
    type: 'download' | 'interactive' | 'link'
    file_path: string | null
    tool_config: any
    status: string
  }
}

export function ToolForm({ tool }: ToolFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: tool?.name || '',
    slug: tool?.slug || '',
    description: tool?.description || '',
    gated_level: tool?.gated_level || 'member' as 'email' | 'member',
    type: tool?.type || 'download' as 'download' | 'interactive' | 'link',
    status: tool?.status || 'draft',
    link_url: tool?.tool_config?.url || '',
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!tool && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData((prev) => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name, tool])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let filePath = tool?.file_path || null

      // Upload file if provided and type is download
      if (file && formData.type === 'download') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cp-files')
          .upload(`tools/${fileName}`, file)

        if (uploadError) throw uploadError
        filePath = uploadData.path
      }

      const toolConfig = formData.type === 'link' ? { url: formData.link_url } : null

      const toolData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        gated_level: formData.gated_level,
        type: formData.type,
        file_path: filePath,
        tool_config: toolConfig,
        status: formData.status,
      }

      if (tool) {
        const { error } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', tool.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('tools').insert(toolData)
        if (error) throw error
      }

      router.push('/admin/toolbox')
      router.refresh()
    } catch (error) {
      console.error('Error saving tool:', error)
      alert('Failed to save tool')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-semibold mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
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

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          required
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Gated level</label>
          <select
            value={formData.gated_level}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gated_level: e.target.value as 'email' | 'member',
              }))
            }
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <option value="email">Email</option>
            <option value="member">Member</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Type</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as 'download' | 'interactive' | 'link',
              }))
            }
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <option value="download">Download</option>
            <option value="interactive">Interactive</option>
            <option value="link">Link</option>
          </select>
        </div>
      </div>

      {formData.type === 'download' && (
        <div>
          <label className="block text-sm font-semibold mb-2">File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
          {tool?.file_path && !file && (
            <p className="text-sm text-charcoal/60 mt-2">Current: {tool.file_path}</p>
          )}
        </div>
      )}

      {formData.type === 'link' && (
        <div>
          <label className="block text-sm font-semibold mb-2">URL</label>
          <input
            type="url"
            value={formData.link_url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, link_url: e.target.value }))
            }
            required
            className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-lg border border-charcoal/20 bg-white focus:outline-none focus:ring-2 focus:ring-orange"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : tool ? 'Update Tool' : 'Create Tool'}
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

