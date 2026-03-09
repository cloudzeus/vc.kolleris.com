'use client'

import dynamic from 'next/dynamic'

const Navigation = dynamic(
  () => import('./navigation').then(mod => ({ default: mod.Navigation })),
  {
    ssr: false,
    loading: () => (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-900 border-b border-slate-800" />
    ),
  }
)

interface NavigationWrapperProps {
  user: any
}

export function NavigationWrapper({ user }: NavigationWrapperProps) {
  return <Navigation user={user} />
}
