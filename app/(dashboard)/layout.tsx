'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Sprout, 
  LayoutDashboard, 
  FileText, 
  AlertCircle, 
  CreditCard, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Policies', href: '/dashboard/policies', icon: FileText },
  { name: 'My Claims', href: '/dashboard/claims', icon: AlertCircle },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className={cn('flex h-full flex-col bg-sidebar text-sidebar-foreground', className)}>
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="h-7 w-7 text-sidebar-primary" />
          <span className="text-lg font-bold">KisanClaim</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="hidden lg:block w-64 border-r">
          <Skeleton className="h-full" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden lg:block w-64 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/claims/new">New Claim</Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
