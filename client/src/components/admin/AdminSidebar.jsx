import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import {
  ImageIcon,
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
  Theater,
  TvMinimalPlay,
  FilePlusCorner
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {

  const [collapsed, setCollapsed] = useState(false)

  const user = {
    firstname: 'Admin',
    lastname: 'User',
    imageUrl: assets.profile,
  }

  const adminNavlinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Shows', path: '/admin/add-shows', icon: FilePlusCorner },
    { name: 'List Shows', path: '/admin/list-shows', icon: TvMinimalPlay },
    { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
    { name: 'Slides', path: '/admin/list-slides', icon: ImageIcon },
    { name: 'Add Slide', path: '/admin/add-slide', icon: FilePlusCorner },
    { name: 'Cinemas', path: '/admin/list-cinemas', icon: Theater },
    { name: 'Add Cinema', path: '/admin/add-cinema', icon: FilePlusCorner },
  ]

  return (
    <div
      className={`h-[calc(100vh-64px)] flex flex-col relative border-r border-gray-200/40 bg-white shadow-sm
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-20' : 'w-60'}`}
    >

      {/* Toggle Button */}
      <button
        className="absolute -right-3 top-4 z-20 bg-white border border-gray-200 rounded-full shadow
        w-7 h-7 flex items-center justify-center
        hover:bg-gray-100 transition"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <PanelRightClose className="w-4 h-4 text-gray-500 transition-transform" />
        ) : (
          <PanelLeftClose className="w-4 h-4  text-gray-500 transition-transform" />
          
        )}
      </button>

      {/* Profile Section */}
      <div className={`flex flex-col items-center py-6 transition-all duration-300`}>
        <img
          src={user.imageUrl}
          alt="Admin"
          className="h-14 w-14 rounded-full border border-gray-300 shadow-md object-cover"
        />
        {!collapsed && (
          <p
            className="mt-3 text-base font-medium text-gray-700 opacity-100 transition-opacity duration-300"
          >
            {user.firstname} {user.lastname}
          </p>
        )}
      </div>

      {/* Nav Items */}
      <div className="mt-4 w-full flex-1">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `relative group flex items-center
              gap-3 w-full py-3 px-5 text-gray-500 font-medium
              transition-all duration-200 cursor-pointer
              hover:bg-gray-100 hover:text-gray-800
              ${isActive ? 'text-primary bg-primary/10 font-semibold' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon */}
                <link.icon
                  className={`w-5 h-5 transition duration-200 
                  ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'}`}
                />

                {/* Label - Hide when collapsed */}
                {!collapsed && (
                  <p className="whitespace-nowrap transition-opacity duration-300">
                    {link.name}
                  </p>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <span
                    className={`absolute right-0 w-1.5 h-10 bg-primary rounded-l-full`}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default AdminSidebar
