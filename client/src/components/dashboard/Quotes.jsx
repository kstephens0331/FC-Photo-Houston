// src/components/dashboard/Quotes.jsx
import React, { useState } from 'react'

const Quotes = () => {
  const [formData, setFormData] = useState({
    itemType: '',
    quantity: '',
    notes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted Quote:', formData)
    alert('Quote request submitted!')
    // In real setup: send to Firebase/Email endpoint
  }

  return (
    <div className="min-h-screen px-6 py-12 md:px-20 text-black">
      <h1 className="text-3xl font-bold mb-6">Request a Quote</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/70 p-6 rounded-xl shadow-lg max-w-2xl">
        <div>
          <label className="block font-medium mb-1">Item Type</label>
          <select
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Select one</option>
            <option value="print">Print</option>
            <option value="photoBook">Photo Book</option>
            <option value="keepsake">Keepsake</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Notes or Preferences</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Add any preferences, sizes, styles, etc..."
            className="w-full border border-gray-300 rounded px-4 py-2"
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  )
}

export default Quotes
