"use client"

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Home,
  Video,
  Building2,
  Users,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  UserPlus,
  Settings,
  FileText,
  Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface NavigationProps {
  user: any
}

interface Company {
  id: string
  name: string
  default: boolean
}

export function Navigation({ user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [defaultCompany, setDefaultCompany] = useState<Company | null>(null)
  const pathname = usePathname()

  // Fetch current default company
  useEffect(() => {
    const fetchDefaultCompany = async () => {
      try {
        const response = await fetch('/api/settings/default-company', {
          cache: 'no-store'
        })

        if (response.ok) {
          const data = await response.json()
          setDefaultCompany(data.defaultCompany)
        }
      } catch (error) {
        console.error('Error fetching default company:', error)
      }
    }

    fetchDefaultCompany()
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const navigationItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/meetings', label: 'Meetings', icon: Video },
    { href: '/recordings', label: 'Recordings', icon: FileText },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/contacts', label: 'Contacts', icon: UserPlus },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/statistics', label: 'Statistics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="bg-black border-b border-slate-800 w-full fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg p-2">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polygon points="10,9 10,15 15,12" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-lg">Video Manager</span>
              </Link>
            </div>


            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <Icon className="h-4 w-4 inline mr-2" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Husk Badge */}
            <div className="hidden lg:flex items-center gap-3">
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold border-0 px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                Husk
              </Badge>

              {/* Icon Buttons */}
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Button>
            </div>

            {/* Company Info (Desktop) */}
            <div className="hidden lg:block text-sm text-muted-foreground">
              <div>{defaultCompany?.name || user.companyName || 'Loading...'}</div>
              <div className="text-xs">{user.departmentName || 'No department'}</div>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-700 hover:bg-slate-600">
                  <div className="flex items-center justify-center w-full h-full text-white font-semibold text-sm">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-slate-400">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-slate-400">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Link href="/license" className="flex items-center">
                    License
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild className="text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-slate-700 hover:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-black">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile User Info */}
            <div className="px-4 py-3 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold text-sm">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {defaultCompany?.name || user.companyName || 'Loading...'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 