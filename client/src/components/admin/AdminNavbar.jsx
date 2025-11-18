import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { ChevronDown } from 'lucide-react'

const AdminNavbar = () => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const closeTimerRef = useRef(null)

  // open immediately, and cancel any pending close timer
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpen(true)
  }

  // start short timer to close (prevents flicker when crossing tiny gap)
  const handleMouseLeave = () => {
    // small delay so user can move pointer into dropdown without it closing
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      closeTimerRef.current = null
    }, 180) // 150-220ms is a sweet spot; tweak as you like
  }

  // close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  return (
    <div
      className="
        h-16 px-6 md:px-10 flex items-center justify-between
        border-b border-gray-200/30 bg-white shadow-sm
      "
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={assets.logo}
          alt="logo"
          className="w-36 h-auto transition-transform duration-200 hover:scale-105"
        />
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <p className="text-gray-600 font-medium max-sm:hidden">Admin Panel</p>

        {/* Avatar + Dropdown wrapper */}
        <div
          ref={wrapperRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          {/* Avatar row (clickable) */}
          <div
            role="button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <img
              src={assets.profile}
              alt="profile"
              className="w-9 h-9 rounded-full border border-gray-300 shadow-sm object-cover"
            />
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Dropdown */}
          <div
            // keep dropdown visually close to avatar (small gap) to reduce chance of crossing bare area
            className={`absolute right-0 mt-2 w-44 py-2 bg-white shadow-lg rounded-xl border border-gray-100 z-20
              transform transition-all duration-150
              ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
            `}
          >
            <Link
              to="/admin/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Profile
            </Link>

            <Link
              to="/admin/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Settings
            </Link>

            <Link
              to="/logout"
              className="block px-4 py-2 text-red-500 hover:bg-red-50"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNavbar
