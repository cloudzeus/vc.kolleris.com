import { Suspense } from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { NavigationWrapper } from '@/components/layout/navigation-wrapper'
import { UserProfile } from '@/components/users/user-profile'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Profile - Video Conference Manager',
  description: 'View and edit your user profile information',
}

export default async function ProfilePage() {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect('/login')
  }

  let user, calls, departments;

  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        companyId: true,
        avatar: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    calls = await prisma.call.findMany({
      where: {
        participants: { some: { userId: user.id } },
        companyId: user.companyId
      },
      include: {
        company: { select: { name: true } },
        participants: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } }
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: { startTime: 'desc' },
      take: 10
    })

    departments = await prisma.department.findMany({
      where: { companyId: user.companyId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Profile data fetch error:', error)
    redirect('/login')
  }

  const fullUser = {
    ...user,
    companyName: session.user.companyName,
    companyType: session.user.companyType,
    departmentId: session.user.departmentId,
    departmentName: session.user.departmentName
  }

  const meetings = calls.map((call: any) => ({
    id: call.id,
    title: call.title,
    description: call.description,
    startTime: call.startTime,
    endTime: call.endTime,
    type: call.type,
    status: call.status,
    createdById: call.createdById,
    participants: call.participants,
    _count: call._count,
    company: call.company
  }))

  return (
    <div className="min-h-screen bg-background">
      <NavigationWrapper user={user} />

      <main className="container-responsive py-6 pt-24">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">
                View and edit your user profile information
              </p>
            </div>
          </div>

          <Suspense fallback={<ProfileSkeleton />}>
            <UserProfile
              user={fullUser}
              currentUser={fullUser}
              meetings={meetings}
              departments={departments}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  )
}
