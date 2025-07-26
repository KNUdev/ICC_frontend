import { Header } from '@/components/Header/Header'
import { CustomHeaderNav } from '@/components/Header/CustomHeaderNav'
import type { PropsWithChildren } from 'react'
import ApplicationsPage from './applications/page'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div>
      <Header customNav={<CustomHeaderNav />} />
      <ApplicationsPage />
      {children}
    </div>
  )
}
