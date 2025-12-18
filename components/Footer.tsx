import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Creator Playbook</h3>
            <p className="text-sm text-charcoal/70">
              Not a course. Not a hustle. This is a journey.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-orange transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-orange transition-colors">
                  Refunds
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-charcoal/70">
              Questions? Reach out.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-charcoal/10 text-center text-sm text-charcoal/60">
          © {new Date().getFullYear()} Creator Playbook. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

