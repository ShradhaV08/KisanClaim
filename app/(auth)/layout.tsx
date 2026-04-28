import Link from 'next/link'
import { Sprout } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">KisanClaim</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center bg-muted/30 p-4">
        {children}
      </main>
    </div>
  )
}
