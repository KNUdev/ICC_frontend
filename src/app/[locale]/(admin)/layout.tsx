import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { RoleGuard } from '@/components/RoleGuard/RoleGuard'
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div>
      <Header />
      <RoleGuard
        requiredPermissions={['canAccessAdminPanel']}
        requiredRoles={['SECRETARY', 'SITE_MANAGER', 'HEAD_MANAGER']}
      >
        {children}
      </RoleGuard>
      <Footer />
    </div>
  )
}
