import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { CustomHeaderNav } from '@/components/Header/CustomHeaderNav'
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div>
      <Header customNav={<CustomHeaderNav />} />
      {children}
      <Footer />
    </div>
  )
}
