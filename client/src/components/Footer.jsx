import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="text-black py-10 px-6 md:px-20 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        {/* Left – Logo & Contact Info */}
        <div className="space-y-2 text-left">
          <img src={logo} alt="FC Photo Houston" className="h-12 w-auto mb-2" />
          <p> FC Photo Houston</p>
          <p>info@fcphotohouston.com</p>
          <p>Houston, TX</p>
          <p>(512) 998-3363</p>
        </div>

        {/* Center – Nav (top) + Legal (bottom) */}
        <div className="flex flex-col justify-between h-full text-center space-y-4">
          <div>
            <div className="flex justify-center flex-wrap gap-6 text-sm font-medium">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/services" className="hover:underline">Sessions</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
              <Link to="/client-gallery" className="hover:underline">Client Gallery</Link>
              <Link to="/login" className="hover:underline">Login</Link>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-700 mt-4">
              © 2025 FC Photo Houston. All rights reserved.{' '}
              <a
                href="https://stephenscode.dev"
                target="_blank"
                rel="noreferrer"
                className="hover:underline no-underline text-inherit"
              >
                Built by StephensCode LLC
              </a>
            </p>
          </div>
        </div>

    {/* Right – Social Links */}
        <div className="flex flex-col items-center md:items-end justify-center space-y-1 text-sm">
            <a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
            <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a>
             <a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" target="_blank" rel="noreferrer" className="hover:underline">Google Reviews</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
