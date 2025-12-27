import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="pt-16 md:pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">
          Terms of Service
        </h1>
        <p className="text-sm text-charcoal/60 dark:text-[#7E8599] mb-12">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-lg max-w-none space-y-8 text-charcoal/80 dark:text-[#B7BCCB] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Creator Playbook ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">2. Description of Service</h2>
            <p>
              Creator Playbook is a monthly platform providing creative resources, events, and tools designed to help creators think clearer and move faster. The Service includes access to monthly playbooks, events, and related content.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">3. User Accounts and Registration</h2>
            <p>
              To access certain features, you may be required to register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Reproduce, duplicate, copy, or resell any part of the Service without permission</li>
              <li>Use automated systems to access the Service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">5. Intellectual Property</h2>
            <p>
              All content on Creator Playbook, including text, graphics, logos, and software, is the property of Creator Playbook or its content suppliers and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">6. Payments and Refunds</h2>
            <p>
              Some features of the Service may require payment. All payments are processed through Stripe. Refund requests are handled on a case-by-case basis. Please see our{' '}
              <Link href="/refunds" className="text-[#FF7A1A] hover:underline">
                Refund Policy
              </Link>
              {' '}for more information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">7. Disclaimers</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. Creator Playbook does not guarantee that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Creator Playbook shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the effective date. Your continued use of the Service after changes become effective constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">10. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:sav@mycreatorplaybook.com" className="text-[#FF7A1A] hover:underline">
                sav@mycreatorplaybook.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
