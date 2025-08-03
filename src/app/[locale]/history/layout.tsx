import { Header } from '@/components/Header/Header'
import { Footer } from '@/components/Footer/Footer'
import  History  from '@/components/History/History'
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <History />
      {children}
      <Footer />
    </div>
  )
}