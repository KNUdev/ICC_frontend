import { Header } from '@/components/Header/Header'
import { AddPhoto } from '@/components/AddPhoto/AddPhoto'
import { CustomHeaderNav } from '@/components/Header/CustomHeaderNav';
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header customNav={<CustomHeaderNav />} />
      <AddPhoto />
      {children}
    </div>
  )
}
