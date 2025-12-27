import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="pt-16 md:pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">
          Privacy Policy
        </h1>
        <p className="text-sm text-charcoal/60 dark:text-[#7E8599] mb-12">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-lg max-w-none space-y-8 text-charcoal/80 dark:text-[#B7BCCB] leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">1. Introduction</h2>
            <p>
              Creator Playbook ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">2. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            
            <h3 className="font-semibold text-lg mt-6 mb-3 text-charcoal dark:text-[#F5F7FF]">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email address, name (if provided during registration)</li>
              <li><strong>Event Registration:</strong> First name, last name, email address, country</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store full payment card details)</li>
            </ul>

            <h3 className="font-semibold text-lg mt-6 mb-3 text-charcoal dark:text-[#F5F7FF]">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> How you interact with the Service</li>
              <li><strong>Device Information:</strong> Browser type, device type, IP address (for security and analytics)</li>
              <li><strong>Cookies:</strong> We use cookies to maintain your session and improve your experience</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process your registrations and payments</li>
              <li>Send you event updates and notifications (with your consent)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a trusted cloud database provider. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">5. Email Communications</h2>
            <p>
              When you register for events or create an account, we may send you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Event registration confirmations</li>
              <li>Event updates and reminders</li>
              <li>Service-related announcements</li>
            </ul>
            <p className="mt-4">
              You can opt out of marketing emails at any time by clicking the unsubscribe link in any email or contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request data portability</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:sav@mycreatorplaybook.com" className="text-[#FF7A1A] hover:underline">
                sav@mycreatorplaybook.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">8. Cookies and Analytics</h2>
            <p>
              We use cookies to maintain your session and improve your experience. We may also use analytics services to understand how the Service is used. These services may collect information about your use of the Service.
            </p>
            <p className="mt-4">
              You can control cookies through your browser settings, though this may affect the functionality of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">9. Third-Party Services</h2>
            <p>
              We use the following third-party services that may collect information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Resend:</strong> Email delivery services</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">10. Children's Privacy</h2>
            <p>
              The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the effective date. Your continued use of the Service after changes become effective constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 text-charcoal dark:text-[#F5F7FF]">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong>{' '}
              <a href="mailto:sav@mycreatorplaybook.com" className="text-[#FF7A1A] hover:underline">
                sav@mycreatorplaybook.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
