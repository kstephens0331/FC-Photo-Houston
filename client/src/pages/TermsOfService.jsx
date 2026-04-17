import React from 'react'
import { Link } from 'react-router-dom'

const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: April 17, 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Agreement to Terms</h2>
          <p>
            By using the FC Photo Houston website or booking our photography services, you agree to these Terms of Service. These terms apply to all visitors, clients, and users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Services Provided</h2>
          <p className="mb-3">FC Photo Houston provides professional photography services including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Portrait and headshot photography</li>
            <li>Event and special occasion photography</li>
            <li>Family and group photography</li>
            <li>Product and commercial photography</li>
            <li>Photo editing and retouching</li>
            <li>Digital delivery via private client gallery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Booking and Scheduling</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Sessions are confirmed upon receipt of a signed agreement and any required deposit</li>
            <li>Session dates and times are subject to photographer availability</li>
            <li>We recommend booking at least 2 weeks in advance for standard sessions</li>
            <li>Rush bookings may be accommodated based on availability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Cancellation and Rescheduling</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cancellations made 48+ hours before the session receive a full refund of any deposit</li>
            <li>Cancellations made within 48 hours may forfeit the deposit</li>
            <li>Rescheduling is free if requested 48+ hours in advance</li>
            <li>Weather-related rescheduling for outdoor sessions is always free</li>
            <li>No-shows forfeit any deposit paid</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Payment Terms</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Pricing is provided via quote based on session type and requirements</li>
            <li>A deposit may be required to secure your session date</li>
            <li>Remaining balance is due at or before the session</li>
            <li>We accept cash, check, Venmo, Zelle, and major credit/debit cards</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Photo Delivery and Usage</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Edited photos are delivered via your private online client gallery</li>
            <li>Delivery time is typically 2-4 weeks after the session, depending on scope</li>
            <li>You receive a personal-use license for all delivered photos</li>
            <li>You may print, share on social media, and use photos for personal purposes</li>
            <li>Commercial use of photos requires separate written agreement</li>
            <li>You may not edit, alter, or remove watermarks from delivered photos without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Copyright and Ownership</h2>
          <p>
            FC Photo Houston retains copyright ownership of all photographs. You receive a personal-use license upon delivery. We may use photos in our portfolio, website, social media, and marketing materials unless you opt out in writing before or during the session. Credit to FC Photo Houston is appreciated but not required for personal social media posts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We are not liable for events beyond our control (weather, venue issues, equipment failure)</li>
            <li>In the unlikely event of total image loss due to equipment failure, liability is limited to a full refund of the session fee</li>
            <li>We maintain backup equipment and follow industry-standard backup procedures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Client Portal</h2>
          <p>
            Our client portal allows you to view your photos, request quotes, and manage your account. You are responsible for keeping your login credentials secure. We reserve the right to remove accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts of Harris County, Texas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
          <p>We may update these Terms of Service. Changes will be posted on this page. Continued use constitutes acceptance.</p>
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

export default TermsOfService
