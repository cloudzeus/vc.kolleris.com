'use client';

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Video, BarChart3, Users, Building2 } from 'lucide-react'
import Link from 'next/link'
import { CreateMeetingButton } from '@/components/meetings/create-meeting-button'

interface QuickActionsProps {
  user: any
  users: any[]
  contacts: any[]
}

export function QuickActions({ user, users, contacts }: QuickActionsProps) {
  const isAdmin = user.role === 'Administrator'
  const isManager = user.role === 'Manager'

  const actions = [
    {
      id: 'create-meeting',
      title: 'Create Meeting',
      description: 'Schedule a new video conference',
      icon: Plus,
      href: '#',
      variant: 'default' as const,
    },
    {
      id: 'join-meeting',
      title: 'Join Meeting',
      description: 'Join an existing meeting',
      icon: Video,
      href: '/meetings',
      variant: 'outline' as const,
    },
    {
      id: 'view-stats',
      title: 'View Statistics',
      description: 'Check usage and analytics',
      icon: BarChart3,
      href: '/statistics',
      variant: 'outline' as const,
    },
    ...(isManager || isAdmin ? [{
      id: 'manage-users',
      title: 'Manage Users',
      description: 'Add or edit user accounts',
      icon: Users,
      href: '/users',
      variant: 'outline' as const,
    }] : []),
    ...(isAdmin ? [{
      id: 'manage-companies',
      title: 'Manage Companies',
      description: 'Company settings and configuration',
      icon: Building2,
      href: '/companies',
      variant: 'outline' as const,
    }] : []),
  ]

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon

            if (action.id === 'create-meeting') {
              return (
                <CreateMeetingButton
                  key={action.title}
                  user={user}
                  users={users}
                  contacts={contacts}
                  customTrigger={
                    <Button
                      variant={action.variant}
                      className="h-auto p-4 flex flex-col items-start gap-2 border-slate-600 hover:bg-slate-700 w-full"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-slate-400">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  }
                />
              )
            }

            return (
              <Button
                key={action.title}
                asChild
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start gap-2 border-slate-600 hover:bg-slate-700"
              >
                <Link href={action.href}>
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-slate-400">
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}