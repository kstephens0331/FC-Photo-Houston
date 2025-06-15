import React from 'react'
import { Link } from 'react-router-dom'
import floralBg from '../assets/gray-floral.png'

const faqs = [
  {
    q: 'How do I book a session?',
    a: (
      <>
        To book a session, you can fill out the contact card on this page, message us on{' '}
        <a
          href="https://www.instagram.com/fcphotohouston/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Instagram
        </a>{' '}
        or{' '}
        <a
          href="https://www.facebook.com/profile.php?id=61574687201175"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Facebook
        </a>, or{' '}
        <Link
          to="/services"
          className="text-blue-600 underline hover:text-blue-800"
        >
          check out with the session you’d like
        </Link>{' '}
        and then book your appointment through your customer portal.
      </>
    ),
  },
  {
  q: 'What types of payment do you accept?',
  a: 'We accept cash, card, Venmo, Zelle, Apple Pay, and payment via the website. A deposit will be required for full-day bookings or events. Please use the contact form and we will send you the deposit payment request via email or text.',
  },
  {
q: 'When will I receive my photos?',
  a: 'Turnaround time is typically 1–2 weeks depending on the season and volume of sessions. We carefully edit each image to preserve natural tones and storytelling detail. If you need your gallery sooner, rush editing is available as an add-on and can often deliver within 2–3 days.'
  },
{
  q: 'Where are you located?',
  a: 'We’re based in Conroe, TX and serve the greater Houston area. For sessions outside of Houston, a travel fee may apply depending on the distance. We strive to keep this fair and transparent — please reach out with your location and we’ll provide an exact quote before booking.'
},
{
  q: 'What kind of equipment do you use?',
  a: 'We shoot with professional-grade DSLR and mirrorless cameras, high-end prime and zoom lenses, and studio lighting when needed. Our gear ensures sharp, well-lit, and cinematic results in any setting.'
},
{
  q: 'Do I get to choose which photos I receive?',
  a: 'We deliver a carefully curated gallery with the best moments from your session — those with strong composition, natural expression, and emotion. You’re welcome to request favorites or additional edits after delivery.'
},
{
  q: 'What should I wear for my session?',
  a: 'Simple, timeless outfits always photograph best. Neutrals, light earth tones, and soft fabrics work beautifully. We’re happy to help you plan a look that fits your location and session vibe.'
},
{
  q: 'Can I order prints or photo books?',
  a: 'Absolutely! We offer high-quality professional prints, canvases, and custom photo books. Just let us know your preferences — we’ll guide you through the options after your gallery is ready.'
},
{
  q: 'Can we include props or pets in the session?',
  a: 'Yes! Props, pets, and personal touches are always welcome. If you have something meaningful in mind, we’ll work it into the story. Just let us know ahead of time so we can plan for it.'
},
{
  q: 'Do you offer retouching or advanced edits?',
  a: 'Every photo receives our signature light retouching — color correction, lighting balance, and cleanup. For advanced edits like skin smoothing or object removal, just ask — we offer those as add-ons.'
}
]

const Contact = () => {
  return (
    <div
      className="min-h-screen text-black px-6 py-12 md:px-20 bg-repeat bg-fixed bg-[length:400px] bg-left-top"
      style={{ backgroundImage: `url(${floralBg})` }}
    >
      <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
      <p className="text-center text-gray-600 mb-12">
        We’d love to hear from you. Reach out directly or check out our FAQs below.
      </p>

      {/* Contact Info */}
      <div className="text-center mb-16 space-y-2">
        <p className="text-lg">Astephens@fcphotohouston.com</p>
        <p className="text-lg">Conroe, TX</p>
        <p className="text-lg">(512) 998-3363</p>
      </div>

      <form
  action="https://formspree.io/f/xzzgdeqg"
  method="POST"
  className="max-w-2xl mx-auto mt-12 mb-12 pb-12 px-6 py-8 rounded-2xl shadow-md border border-white/30 bg-white/30 backdrop-blur-md space-y-6"
>
  <h2 className="text-2xl font-bold text-center text-black">Send Us a Message</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label htmlFor="name" className="block font-semibold text-gray-700 mb-1">
        Name<span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>

    {/* ContactUs Form Section */}
    <div>
      <label htmlFor="phone" className="block font-semibold text-gray-700 mb-1">
        Phone Number<span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>

    <div className="md:col-span-2">
      <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
        Email Address<span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>

    <div className="md:col-span-2">
      <label htmlFor="message" className="block font-semibold text-gray-700 mb-1">
        Message<span className="text-red-500">*</span>
      </label>
      <textarea
        id="message"
        name="message"
        required
        rows="5"
        className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
      ></textarea>
    </div>
  </div>

  <div className="text-center">
    <button
      type="submit"
      className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
    >
      Send Message
    </button>
  </div>
</form>


      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-8">
        {faqs.map((item, idx) => (
          <details
            key={idx}
            className="border border-white/30 backdrop-blur-md p-6 rounded-2xl shadow-md transition"
          >
            <summary className="cursor-pointer font-semibold text-lg text-black">
              {item.q}
            </summary>
            <div className="mt-2 text-gray-800">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

export default Contact
