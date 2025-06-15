import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

const Navbar = () => {
  const { pathname } = useLocation()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
    { label: 'Client Login', path: '/client-login' },
  ]

  return (
    <header className="bg-white shadow-sm px-6 py-4 md:px-20">
      <div className="flex justify-between items-center">
        {/* Logo */}
<Link to="/" className="flex items-center space-x-2">
  <img
    src={logo}
    alt="FC Photo Houston"
    className="h-10 sm:h-12 md:h-14 w-auto object-contain"
  />
  FC Photo Houston
</Link>

        {/* Nav Links */}
        <nav className="space-x-4 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hover:text-black transition ${
                pathname === item.path ? 'text-black font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
