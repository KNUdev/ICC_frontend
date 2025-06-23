import { Footer } from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const tCommon = useTranslations('common')
  const tHome = useTranslations('home')
  return (
    <div>
      {/* <LanguageSwitcher />
      <h1>{tCommon('title')}</h1>
      <h2>{tHome('title')}</h2> */}
      <Header />
      <Footer />
    </div>
  )
}
