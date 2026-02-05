import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import StaffClient from './StaffClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  return {
    title: t('navigation.STAFF'),
  }
}

export default function StaffPage() {
  return <StaffClient />
}
