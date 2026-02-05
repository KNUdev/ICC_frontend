import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import PhotoGalleryClient from './PhotoGalleryClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  return {
    title: t('navigation.PHOTO_GALLERY'),
  }
}

export default function PhotoGalleryPage() {
  return <PhotoGalleryClient />
}