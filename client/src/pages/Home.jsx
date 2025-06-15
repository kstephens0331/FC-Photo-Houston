import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/aisha_1.png'
import ImageCollage from '../components/ImageCollage'
import floralBg from '../assets/gray-floral.png'
import logo from '../assets/logo.png'

const Home = () => {
  return (
    <div
      className="min-h-screen bg-repeat bg-[length:400px] bg-fixed bg-left-top"
      style={{ backgroundImage: `url(${floralBg})` }}
    >
      {/* Hero Section */}
<section className="relative h-[50vh] overflow-hidden">

  {/* Logo Top Left */}
  <div className="absolute left-40 top-1/2 transform -translate-y-1/2 z-30">
  <img
    src={logo}
    alt="FC Photo Houston"
    className="h-70 md:h-80 w-auto object-contain"
  />
</div>

  {/* Right Image */}
  <img
    src={heroImage}
    alt="Framed elegance"
    className="absolute right-[1%] top-1/2 transform -translate-y-1/2 w-[40%] md:w-[30%] rounded-lg shadow-xl border-4 border-white object-cover"
    style={{ zIndex: 10 }}
  />

  {/* Centered Headline and CTA */}
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 px-2 space-y-12">
    <h1 className="text-3xl md:text-5xl font-bold leading-snug">
      Capturing<br />The Heart of<br />Every Moment
    </h1>

    <Link
      to="/services"
      className="inline-block mt-4 px-6 py-2 md:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
    >
      Explore Sessions
    </Link>
  </div>
</section>

      {/* Emotional Tagline Section */}
      <section className="relative py-24">
        <div className="text-center px-6 md:px-20">
          <p className="text-3xl md:text-5xl font-light leading-snug text-gray-800 opacity-0 animate-fade-in">
            This is what<br />your memories<br />will feel like.
          </p>
        </div>
      </section>

      {/* Scrapbook + Sessions Layout */}
      <section className="flex flex-col md:flex-row px-6 md:px-22 py-20 gap-12">
        {/* Left Column – Collage + Final Two */}
        <div className="w-full md:w-1/2 space-y-10">
          <ImageCollage />
          {/* Final Two Categories */}
          {[
            {
              title: 'Professional Headshots',
              desc: 'Whether for LinkedIn or leadership, our headshots are clean, confident, and elevated.',
            },
            {
              title: 'Website & Branding Sessions',
              desc: 'High-resolution imagery crafted for business owners, creators, and teams.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition transform hover:scale-[1.01]"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Right Column – Top 5 Categories */}
        <div className="w-full md:w-1/2 space-y-10">
          {[
            {
              title: 'Weddings',
              desc: 'We document love with subtlety and soul. From first looks to final dances, every glance matters.',
            },
            {
              title: 'Portraits',
              desc: 'Timeless and personal, our portraits capture confidence, emotion, and a sense of self.',
            },
            {
              title: 'Maternity',
              desc: 'Celebrate the beauty of new beginnings. These sessions are slow, styled, and intentionally tender.',
            },
            {
              title: 'Cake Smash',
              desc: 'Playful, messy, and joy-filled — cake smash sessions are a celebration of personality and growth.',
            },
            {
              title: 'Studio Minis',
              desc: 'Crisp, styled, and quick — our mini sessions are crafted with seasonal vibes and timeless energy.',
            },
            {
              title: 'Family',
              desc: 'We freeze the fleeting — laughter, little arms, and big personalities. Let’s tell your story as you are.',
            },
            {
            title: 'Events',
            desc: 'From intimate gatherings to large celebrations — we capture the atmosphere, emotion, and unforgettable moments as they unfold.',
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition transform hover:scale-[1.01]"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
