import { useTranslations } from 'next-intl'
import styles from './History.module.scss'
import Link from 'next/link'
import ArrowUpIcon from '@/assets/image/icons/history/arrow-up.svg'
import HomeIcon from '@/assets/image/icons/history/home.svg'

import Decor1 from '@/assets/image/icons/history/decor1.svg'
import Decor2 from '@/assets/image/icons/history/decor2.svg'
import Decor3 from '@/assets/image/icons/history/decor3.svg'
import Decor4 from '@/assets/image/icons/history/decor4.svg'
import Decor5 from '@/assets/image/icons/history/decor5.svg'
import Decor6 from '@/assets/image/icons/history/decor6.svg'
import Decor7 from '@/assets/image/icons/history/decor7.svg'
import Decor8 from '@/assets/image/icons/history/decor8.svg'
import Decor9 from '@/assets/image/icons/history/decor9.svg'
import Decor10 from '@/assets/image/icons/history/decor10.svg'
import Decor11 from '@/assets/image/icons/history/decor11.svg'
import Decor12 from '@/assets/image/icons/history/decor12.svg'

const decorIcons = [
  Decor1, Decor2, Decor3, Decor4, Decor5, Decor6,
  Decor7, Decor8, Decor9, Decor10, Decor11, Decor12
]

export default function History() {
  const t = useTranslations('history')
  const title = t('title')
  const scrollTop = t('scrollTop')
  const back = t('back')
  const homepage = t('homepage')
  const historypage = t('historypage')
  

  const sectionKeys = Object.keys(t.raw('sections'))
  const sections = sectionKeys.map((key) => {
    const section = t.raw(`sections.${key}`) as {
      title: string
      text: string
    }
    return {
      id: `section-${key}`,
      title: section.title,
      text: section.text
    }
  })

  return (
    <section className={styles.historyWrapper} id="top">
      <Link href="/" className={styles.homeLink}>
        <HomeIcon />
        <span>{back}</span>
      </Link>

      <div className={styles.titleBlock}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.svgDecor}>
          {decorIcons.map((Icon, index) => (
            <Icon key={index} />
          ))}
          <div className={styles.leftShadow} />
          <div className={styles.rightShadow} />
        </div>
      </div>

      <div className={styles.breadcrumbs}>
        <span>{homepage}</span>
        <span>&gt;</span>
        <strong>{historypage}</strong>
      </div>

      <div className={styles.content}>
        {sections.map((section) => (
          <section key={section.id} className={styles.section}>
            <h3>{section.title}</h3>
            <p>{section.text}</p>
          </section>
        ))}
      </div>

      <a href="#top" className={styles.scrollTop}>
        <ArrowUpIcon />
        {scrollTop}
      </a>
    </section>
  )
}
