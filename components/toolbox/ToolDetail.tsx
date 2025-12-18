'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { EmailGateModal } from './EmailGateModal'

interface ToolDetailProps {
  tool: {
    id: string
    slug: string
    name: string
    description: string
    type: 'download' | 'interactive' | 'link'
    file_path?: string | null
    tool_config?: any
  }
  canAccess: boolean
  requiresEmail: boolean
}

export function ToolDetail({ tool, canAccess, requiresEmail }: ToolDetailProps) {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (canAccess && tool.type === 'download' && tool.file_path) {
      fetchSignedUrl()
    }
  }, [canAccess, tool])

  const fetchSignedUrl = async () => {
    if (!tool.file_path) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.storage
      .from('cp-files')
      .createSignedUrl(tool.file_path, 3600)

    if (data?.signedUrl) {
      setDownloadUrl(data.signedUrl)
    }
    setLoading(false)
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          {tool.name}
        </h1>
        <p className="text-xl text-charcoal/80">{tool.description}</p>
      </div>

      {requiresEmail && (
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5 mb-8">
          <p className="text-lg mb-4">This toolkit requires email access.</p>
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
          >
            Unlock toolkit
          </button>
        </div>
      )}

      {!canAccess && !requiresEmail && (
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5 mb-8">
          <p className="text-lg mb-4">This toolkit is for members only.</p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
          >
            Join to unlock
          </Link>
        </div>
      )}

      {canAccess && (
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-charcoal/5">
          {tool.type === 'download' && (
            <div>
              <button
                onClick={handleDownload}
                disabled={loading || !downloadUrl}
                className="px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Download toolkit'}
              </button>
            </div>
          )}
          {tool.type === 'link' && tool.tool_config?.url && (
            <div>
              <a
                href={tool.tool_config.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-orange text-offwhite rounded-full font-semibold hover:bg-orange/90 transition-colors"
              >
                Open resource
              </a>
            </div>
          )}
          {tool.type === 'interactive' && (
            <div>
              <p className="text-charcoal/80 mb-4">Interactive tool coming soon.</p>
            </div>
          )}
        </div>
      )}

      {showEmailModal && (
        <EmailGateModal
          toolId={tool.id}
          toolName={tool.name}
          onClose={() => setShowEmailModal(false)}
          onSuccess={() => {
            setShowEmailModal(false)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}

