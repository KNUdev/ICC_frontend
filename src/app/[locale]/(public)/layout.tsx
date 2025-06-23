import { Footer } from '@/components/Footer/Footer'
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  )
}
