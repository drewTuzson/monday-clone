import { Outlet, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Dashboard', path: '/' }]

    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'workspace') {
        breadcrumbs.push({ name: 'Workspace', path: `/workspace/${pathSegments[1]}` })
      } else if (pathSegments[0] === 'board') {
        breadcrumbs.push({ name: 'Board', path: `/board/${pathSegments[1]}` })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-monday-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Monday Clone</h1>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/'
                      ? 'bg-monday-blue/10 text-monday-blue'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    // Navigate to My Work view when implemented
                    console.log('Navigate to My Work')
                  }}
                >
                  My Work
                </button>
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    // Navigate to notifications when implemented
                    console.log('Navigate to Notifications')
                  }}
                >
                  Inbox
                </button>
              </nav>
            </div>

            {/* Center - Search */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="w-full relative">
                <label htmlFor="global-search" className="sr-only">
                  Search everything
                </label>
                <input
                  id="global-search"
                  type="text"
                  placeholder="Search everything..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
                  aria-label="Search across all workspaces and boards"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right side - Actions and Profile */}
            <div className="flex items-center space-x-3">
              {/* Quick Actions */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center space-x-1"
                onClick={() => {
                  // Open create item modal when implemented
                  console.log('Create new item')
                }}
              >
                <span>+</span>
                <span>Add</span>
              </Button>

              {/* Notifications */}
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2"
                onClick={() => {
                  // Open notifications panel when implemented
                  console.log('Open notifications')
                }}
                aria-label="View notifications (1 unread)"
                aria-describedby="notification-count"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 10a6 6 0 1112 0v3.5a2.5 2.5 0 002.5 2.5H3.5A2.5 2.5 0 006 13.5V10z" />
                </svg>
                {/* Notification badge */}
                <span 
                  id="notification-count"
                  className="absolute -top-1 -right-1 w-2 h-2 bg-monday-red rounded-full"
                  aria-hidden="true"
                ></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-monday-blue focus:ring-offset-2"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="menu"
                  aria-label={`User menu for ${user?.name}`}
                  id="user-menu-button"
                >
                  <div className="w-8 h-8 bg-monday-blue rounded-full flex items-center justify-center" aria-hidden="true">
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-2 border-b border-gray-100" role="presentation">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        // Navigate to profile settings when implemented
                        console.log('Navigate to profile settings')
                      }}
                      role="menuitem"
                    >
                      Profile Settings
                    </button>
                    
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        // Navigate to workspace settings when implemented
                        console.log('Navigate to workspace settings')
                      }}
                      role="menuitem"
                    >
                      Workspace Settings
                    </button>
                    
                    <div className="border-t border-gray-100 mt-1 pt-1" role="presentation">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50"
                        onClick={() => {
                          setIsProfileMenuOpen(false)
                          logout()
                        }}
                        role="menuitem"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-200">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center space-x-2">
                  {index > 0 && (
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  <Link
                    to={crumb.path}
                    className={`transition-colors ${
                      index === breadcrumbs.length - 1
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Click outside handler for profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </div>
  )
}