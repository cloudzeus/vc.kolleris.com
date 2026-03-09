import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/api/auth',
  '/api/webhooks',
]

// Guest join links pattern
const guestJoinPattern = /^\/meetings\/[^/]+\/join\/[^/]+$/

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Allow public routes
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isGuestJoin = guestJoinPattern.test(pathname)

  if (isPublicRoute || isGuestJoin) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}