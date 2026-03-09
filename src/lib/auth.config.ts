import type { NextAuthConfig } from 'next-auth'

// Auth configuration for edge runtime (middleware)
// This config should NOT import Prisma or bcrypt as they don't work in edge runtime
export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnLogin = nextUrl.pathname.startsWith('/login')

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn && isOnLogin) {
                return Response.redirect(new URL('/dashboard', nextUrl))
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.companyId = (user as any).companyId
                token.companyName = (user as any).companyName
                token.companyType = (user as any).companyType
                token.departmentId = (user as any).departmentId
                token.departmentName = (user as any).departmentName
                token.firstName = (user as any).firstName
                token.lastName = (user as any).lastName
                token.avatar = (user as any).avatar
                token.phone = (user as any).phone
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    email: token.email as string,
                    firstName: token.firstName as string,
                    lastName: token.lastName as string,
                    role: token.role as string,
                    companyId: token.companyId as string,
                    companyName: token.companyName as string,
                    companyType: token.companyType as string,
                    departmentId: token.departmentId as string | null,
                    departmentName: token.departmentName as string | null,
                    avatar: token.avatar as string | null,
                    phone: token.phone as string | null,
                }
            }
            return session
        },
    },
    providers: [], // Providers will be added in auth.ts
} satisfies NextAuthConfig
