'use client';

import { Footer } from '@/components/Footer/Footer';
import Accordion from '@/components/Accordion/Accordion';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from '@/components/Accordion/Accordion.module.scss';

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  const faqItems = t.raw('faq.items') as { title: string; content: string }[];

  const accordionItems = faqItems.map((item, index) => ({
    id: `faq-${index}`,
    title: item.title,
    content: <p>{item.content}</p>,
  }));

  return (
    <div>
      <LanguageSwitcher />
      <h1 >{t('title')}</h1>

      <a href="#faq" style={{ textDecoration: 'underline', color: 'blue' }}>
        Часті запитання
      </a>

      <div style={{ height: '400px' }} />

      <section id="faq">
        <h2 className={styles.sectionTitle}>{t('faq.title')}</h2>
        <Accordion items={accordionItems} />
      </section>

      <Footer />
    </div>
  );
}
