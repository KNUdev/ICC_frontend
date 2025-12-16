import FAQ from '@/app/[locale]/(public)/(home)/components/FAQ/FAQ'
import { AnimatedBrain } from '@/common/animations/AnimatedBrain/AnimatedBrain'
import { AnimatedHistory } from '@/common/animations/AnimatedHistory/AnimatedHistory'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import { PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import style from './page.module.scss'

export default function HomePage() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')

  return (
    <div className={style.homePage + ' main-wrapper'}>
      <div className={style.into}>
        <div>
          <h1>
            {t.rich('heading', {
              span: (chunks) => (
                <span className={style.accentColor}>{chunks}</span>
              ),
            })}
          </h1>
          <p>
            {' '}
            {t.rich('subheading', {
              span: (chunks) => (
                <span className={style.accentColor}>{chunks}</span>
              ),
            })}
          </p>
        </div>
        <div>
          <AnimatedBrain />
        </div>
      </div>

      <div className={style.into}>
        <div>
          <h1>{t('historyHeading')}</h1>
          <p>{t('historySubheading')}</p>
          <Hyperlink href={PAGES.HISTORY}>{tCommon('seeMore')}</Hyperlink>
        </div>
        <div>
          <AnimatedHistory />
        </div>
      </div>
      <FAQ />
    </div>
  )
}
