import { Suspense } from 'react'
import PlaybookClient from './PlaybookClient'

export default function PlaybookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-charcoal dark:text-[var(--text)]">Loading...</div>
      </div>
    }>
      <PlaybookClient />
    </Suspense>
  )
}
