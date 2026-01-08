'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavbarProps {
  isAuthenticated?: boolean
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-teal-600">Fresh Folds</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/providers"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Become a Provider
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/providers"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Become a Provider
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-teal-600 hover:text-teal-700 hover:bg-gray-50 rounded-md"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-base font-medium text-teal-600 hover:text-teal-700 hover:bg-gray-50 rounded-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
