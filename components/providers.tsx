'use client'

import { SWRConfig } from 'swr'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
      }}
    >
      {children}
      <Toaster position="top-right" />
    </SWRConfig>
  )
}
