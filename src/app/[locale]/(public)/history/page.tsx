import HistoryIcon from '@/assets/image/icons/animation/history.svg'
import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import ArrowUpIcon from '@/assets/image/icons/history/arrow-up.svg'
import HomeIcon from '@/assets/image/icons/icon_home.svg'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import { PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import styles from './page.module.scss'

export default function History() {
  const tCommon = useTranslations('common')
  const t = useTranslations('history')
  const scrollTop = t('scrollTop')

  const sectionKeys = Object.keys(t.raw('sections'))
  const sections = sectionKeys.map((key) => {
    const section = t.raw(`sections.${key}`) as {
      title: string
      text: string
    }
    return {
      id: `section-${key}`,
      title: section.title,
      text: section.text,
    }
  })
  return (
    <div>
      <section className={styles.historyPage + ' main-wrapper'} id='top'>
        <div className={styles.header}>
          <div className='hyperlink-container'>
            <Hyperlink href={PAGES.HOME}>
              <div className={styles.hyperlink}>
                <HomeIcon />
                <span>{tCommon('backToHome')}</span>
              </div>
            </Hyperlink>
          </div>
          <div className={styles.galleryHeader}>
            <div className={styles.galleryHeaderContainer}>
              <div className={styles.galleryIconsWrapper}>
                {[...Array(5)].map((_, rowIdx) => (
                  <div key={rowIdx} className={styles.galleryIcons}>
                    {[...Array(6)].map((_, iconIdx) => (
                      <HistoryIcon
                        key={iconIdx}
                        className={styles.galleryIcon}
                      />
                    ))}
                  </div>
                ))}
                {[...Array(5)].map((_, rowIdx) => (
                  <div key={`set2-${rowIdx}`} className={styles.galleryIcons}>
                    {[...Array(6)].map((_, iconIdx) => (
                      <HistoryIcon
                        key={iconIdx}
                        className={styles.galleryIcon}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className={`${styles.gradientShadow} ${styles.shadow_1}`} />
              <div className={`${styles.gradientShadow} ${styles.shadow_2}`} />
              <h1 className={styles.title}>{t('title')}</h1>
            </div>
          </div>
          <div className={styles.breadcrumbs}>
            <Link href={PAGES.HOME} className={styles.navLink}>
              {tCommon('navigation.HOME')}
            </Link>
            <ArrowRight />
            <span className={styles.currentPage}>
              {tCommon('navigation.HISTORY')}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          {sections.map((section) => (
            <section key={section.id} className={styles.section}>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </section>
          ))}
        </div>

        <a href='#top' className={styles.scrollTop}>
          <ArrowUpIcon />
          {scrollTop}
        </a>
      </section>
    </div>
  )
}
