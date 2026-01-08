import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header with logo */}
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-teal-600">
            Fresh Folds
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Simple footer */}
      <footer className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Fresh Folds. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
