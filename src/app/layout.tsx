import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AUTONOMOUS',
  description: 'The command center for an AI-run startup',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-[#0f2942] text-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold">AUTONOMOUS</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1a3b5d]">Dashboard</a>
                <a href="/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1a3b5d]">Products</a>
                <a href="/board" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1a3b5d]">Board</a>
              </div>
            </div>
          </div>
        </nav>
        
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}