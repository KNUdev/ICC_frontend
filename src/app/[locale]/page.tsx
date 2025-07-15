import { Footer } from '@/components/Footer/Footer';
import FAQ from '@/components/FAQ/FAQ';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main>
      <LanguageSwitcher />
      <h1>{t('title')}</h1>

      <a href="#faq" style={{ textDecoration: 'underline', color: 'blue' }}>
        {t('faq.title')}
      </a>

      <div style={{ height: '40rem' }} /> 

      <FAQ />
      <Footer />
    </main>
  );
}
