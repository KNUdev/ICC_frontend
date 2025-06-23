import { Form } from '@/components/Form/Form'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const tCommon = useTranslations('common')
  const tHome = useTranslations('home')
  return (
    <div>
      <LanguageSwitcher />
      <h1>{tCommon('title')}</h1>
      <h2>{tHome('title')}</h2>
      <Form />
    </div>
  )
}
