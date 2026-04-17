import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: April 17, 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <p className="mb-3">FC Photo Houston ("we," "us," or "our") collects information that you provide when you:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Create a customer account to access your photo gallery</li>
            <li>Book a photography session through our website or social media</li>
            <li>Submit a contact form or quote request</li>
            <li>Communicate with us via email, phone, or social media</li>
          </ul>
          <p className="mt-3">
            This information may include your name, email address, phone number, event details, session preferences, and any photos we take during your session.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Schedule and manage your photography sessions</li>
            <li>Deliver edited photos through your private client gallery</li>
            <li>Send session reminders and follow-up communications</li>
            <li>Process quotes and invoices</li>
            <li>Respond to inquiries and support requests</li>
            <li>Improve our website and services</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Your Photos</h2>
          <p>
            Photos taken during your session are stored securely and accessible through your private client gallery. We may use selected photos in our portfolio, website, or social media with your consent. You may opt out of portfolio usage at any time by contacting us. We will never use your photos for commercial purposes beyond showcasing our work without your explicit written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
          <p className="mb-3">Our website integrates with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Supabase:</strong> Customer accounts, photo storage, and session management</li>
            <li><strong>Firebase:</strong> Authentication services</li>
            <li><strong>Formspree:</strong> Contact form processing</li>
          </ul>
          <p className="mt-3">Each service has its own privacy policy governing their data handling.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Security</h2>
          <p>
            We implement reasonable security measures to protect your information. Our website uses HTTPS encryption. Client galleries require authentication to access. However, no method of electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Request access to your personal information and photos</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of portfolio/social media usage of your photos</li>
          </ul>
          <p className="mt-3">
            Contact us at <a href="mailto:info@fcphotohouston.com" className="text-blue-600 hover:underline">info@fcphotohouston.com</a> or call <a href="tel:5129983363" className="text-blue-600 hover:underline">(512) 998-3363</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page.</p>
        </section>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <strong>FC Photo Houston</strong> | Houston, TX | <a href="mailto:info@fcphotohouston.com" className="text-blue-600 hover:underline">info@fcphotohouston.com</a> | <a href="tel:5129983363" className="text-blue-600 hover:underline">(512) 998-3363</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
