'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'

export function UploadPlaybookForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    month: '', // YYYY-MM format
    description: '',
    price_cents: 100,
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Get event date from month (first day of month)
  const getEventDate = (month: string) => {
    if (!month) return new Date().toISOString().split('T')[0]
    return `${month}-01`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!pdfFile) {
        setError('Please select a PDF file')
        setLoading(false)
        return
      }

      if (!formData.title || !formData.month) {
        setError('Title and month are required')
        setLoading(false)
        return
      }

      const supabase = createClient()
      
      // Upload PDF to Supabase Storage
      const fileExt = pdfFile.name.split('.').pop()
      const fileName = `${generateSlug(formData.title)}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('creator-playbook-pdfs')
        .upload(fileName, pdfFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Create volume record
      const volumeData = {
        title: formData.title,
        slug: generateSlug(formData.title),
        event_date: getEventDate(formData.month),
        one_line_promise: formData.description || `Monthly playbook for ${formData.month}`,
        description: formData.description || null,
        youtube_url: null,
        status: 'draft',
        price_cents: formData.price_cents,
        pdf_path: fileName,
      }

      const { error: insertError } = await supabase
        .from('volumes')
        .insert(volumeData)

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`)
      }

      // Success - redirect to volumes list
      router.push('/admin/volumes')
      router.refresh()
    } catch (err: any) {
      console.error('Error uploading playbook:', err)
      setError(err.message || 'Failed to upload playbook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1a1f]/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-[#2a2a35] shadow-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="title"
          type="text"
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Chapter 1: Intention"
          required
        />

        <AuthInput
          id="month"
          type="month"
          label="Month (YYYY-MM)"
          value={formData.month}
          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          required
        />

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-[#a0a0a0]">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="A short description of this month's playbook..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#0f0f12]/50 border border-[#2a2a35] text-[#f2f2f2] placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50 transition-all duration-300"
          />
        </div>

        <AuthInput
          id="price_cents"
          type="number"
          label="Price (cents)"
          value={formData.price_cents}
          onChange={(e) => setFormData({ ...formData, price_cents: parseInt(e.target.value) || 100 })}
          min="100"
          step="100"
          required
        />

        <div className="space-y-2">
          <label htmlFor="pdf" className="block text-sm font-medium text-[#a0a0a0]">
            PDF File
          </label>
          <input
            id="pdf"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            required
            className="w-full px-4 py-3 rounded-xl bg-[#0f0f12]/50 border border-[#2a2a35] text-[#f2f2f2] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FF7A1A] file:text-white hover:file:bg-[#FF7A1A]/90 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/50 focus:border-[#FF7A1A]/50 transition-all duration-300"
          />
          {pdfFile && (
            <p className="text-sm text-[#a0a0a0] mt-1">
              Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="flex gap-4">
          <AuthButton loading={loading} className="flex-1">
            Upload Playbook
          </AuthButton>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3.5 rounded-xl font-semibold bg-[#2a2a35] text-[#f2f2f2] hover:bg-[#3a3a45] border border-[#3a3a45] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}
