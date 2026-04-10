import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const boardPassword = process.env.NEXT_PUBLIC_BOARD_PASSWORD
  
  // Check if we're accessing the board page
  if (request.nextUrl.pathname.startsWith('/board')) {
    // For demo purposes, we'll just check if the env var is set
    // In a real application, this would be more secure with proper auth
    if (!boardPassword) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/board/:path*',
}