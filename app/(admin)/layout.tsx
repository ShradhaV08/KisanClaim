'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Sprout, 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertCircle,
  LogOut,
  Menu,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Plans', href: '/admin/plans', icon: FileText },
  { name: 'Claims', href: '/admin/claims', icon: AlertCircle },
]

function AdminSidebar({ className }: { className?: string }) {
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

      <div className="px-6 py-3">
        <Badge variant="secondary" className="w-full justify-center">
          Admin Panel
        </Badge>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
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

      <div className="border-t border-sidebar-border p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          asChild
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Site
          </Link>
        </Button>
        <div className="px-2 py-2">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [isLoading, user, router])

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

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden lg:block w-64 shrink-0">
        <AdminSidebar />
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
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
