import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-6xl font-bold mb-4 text-black">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link to="/" className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound