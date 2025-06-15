import React from 'react'
import floralBg from '../assets/gray-floral.png'

const Services = () => {
  return (
    <div
      className="min-h-screen text-black px-6 py-12 md:px-20 bg-repeat bg-fixed bg-[length:400px] bg-left-top"
      style={{ backgroundImage: `url(${floralBg})` }}
    >
      <h1 className="text-4xl font-bold mb-6 text-center tracking-tight">Photography Services</h1>
      <p className="text-lg text-center text-gray-600 mb-12">
        Elegant, timeless, and real — photography that captures the heart of every moment.
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Half Session */}
        <div className="border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold">Half Session</h2>
          <p className="text-sm text-gray-500">30–45 minutes — <span className="font-bold">$75</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>1 location</li>
            <li>10+ edited images</li>
            <li>Private online gallery</li>
          </ul>
        </div>

        {/* Full Session */}
        <div className="border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold">Full Session</h2>
          <p className="text-sm text-gray-500">1–1¼ hours — <span className="font-bold">$125</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>1–2 nearby locations</li>
            <li>20+ edited images</li>
            <li>Optional outfit change</li>
            <li>Private online gallery</li>
          </ul>
        </div>

        {/* Full Day */}
        <div className="border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold">Full Day</h2>
          <p className="text-sm text-gray-500">6 hours — <span className="font-bold">$750</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>Multiple locations</li>
            <li>Wardrobe changes</li>
            <li>75+ edited images</li>
            <li>Optional USB keepsake</li>
          </ul>
        </div>

        {/* Event Photography */}
        <div className="border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold">Event Photography</h2>
          <p className="text-sm text-gray-500">$125/hour</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
            <li>Weddings, showers, parties</li>
            <li>Candid & posed coverage</li>
            <li>Optional second shooter</li>
            <li>Online gallery delivery</li>
          </ul>
        </div>
      </div>

      {/* Add-ons */}
      <div className="mt-20 border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-4">Optional Add-Ons</h3>
        <ul className="mt-4 space-yt-2 list-disc list-inside text-sm text-gray-700 space-y-3">
          <li>Rush Editing (48-hour turnaround): <span className="font-bold">+ $75</span></li>
          <li>USB Keepsake Delivery: <span className="font-bold">+ $25</span></li>
          <li>Second Photographer (Events only): <span className="font-bold">+ $75/hr</span></li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-lg font-medium">Ready to create something beautiful?</p>
        <a
          href="/contact"
          className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Book Your Session
        </a>
      </div>
    </div>
  )
}

export default Services
