import Accordion from '@/app/[locale]/(public)/(home)/components/FAQ/Accordion/Accordion'
import { useTranslations } from 'next-intl'
import styles from './FAQ.module.scss'

export default function FAQ() {
  const t = useTranslations('faq')

  const title = t('title')

  const itemKeys = Object.keys(t.raw('items'))

  const items = itemKeys.map((key) => {
    const item = t.raw(`items.${key}`) as { title: string; content: string }
    return {
      title: item.title,
      content: item.content,
    }
  })

  const accordionItems = items.map((item, index) => ({
    id: `faq-${index}`,
    title: item.title,
    content: <p>{item.content}</p>,
  }))

  return (
    <section className={styles.section} id='faq'>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <Accordion items={accordionItems} />
    </section>
  )
}
