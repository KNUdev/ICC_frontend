import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='container'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
