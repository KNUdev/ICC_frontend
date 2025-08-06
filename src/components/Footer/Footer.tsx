import logoKnu from '@/assets/image/icons/logo_knu.png'
import FacebookIcon from '@/assets/image/icons/social/facebook.svg'
import InstagramIcon from '@/assets/image/icons/social/instagram.svg'
import LinkedInIcon from '@/assets/image/icons/social/linkedin.svg'
import Mail from '@/assets/image/icons/social/mail.svg'
import Telephone from '@/assets/image/icons/social/telephone.svg'
import ContactLink from '@/common/components/ContactLink/ContactLink'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import {
  FACULTY_LINKS,
  INSTITUTION_LINKS,
  PAGES,
} from '@/shared/config/page.config'
import { CONTACT_INFO } from '@/shared/data/footer.data'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.scss'

export function Footer() {
  const tFooter = useTranslations('footer')
  const tCommon = useTranslations('common')

  return (
    <footer id={styles.footer} role='contentinfo'>
      <div className='layout-wrapper'>
        <header className={styles.container}>
          <h2 className={styles.infoHeading}>{tCommon('titleFullName')}</h2>
          <Image
            src={logoKnu}
            className={styles.footerLogo}
            alt={`${tCommon('titleFullName')} logo`}
            width={80}
            height={86}
            priority
          />
        </header>

        <hr className={styles.divider} role='separator' />

        <nav
          className={styles.navLinks}
          role='navigation'
          aria-label='Footer navigation'
        >
          <section className={styles.navContainer}>
            <h3 className={styles.heading}>{tCommon('navigationHeading')}</h3>

            <ul className={styles.list} role='list'>
              {Object.entries(PAGES).map(([key, link]) => (
                <li key={key} role='listitem'>
                  <Link href={link} className='navLink'>
                    {tCommon(`navigation.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.navContainer}>
            <h3 className={styles.heading}>{tCommon('institutionsHeading')}</h3>

            <ul className={styles.list} role='list'>
              {Object.entries(INSTITUTION_LINKS)
                .slice(0, 5)
                .map(([key, link]) => (
                  <li key={key} role='listitem'>
                    <a
                      href={link}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={`${tCommon(
                        `institutions.${key}`,
                      )} (opens in a new tab)`}
                      className='navLink'
                    >
                      {tCommon(`institutions.${key}`)}
                    </a>
                  </li>
                ))}

              <li role='listitem'>
                <Hyperlink href={'/institutions'}>
                  {tCommon('seeMore')}
                </Hyperlink>
              </li>
            </ul>
          </section>

          <section className={styles.navContainer}>
            <h3 className={styles.heading}>{tCommon('facultiesHeading')}</h3>

            <ul className={styles.list} role='list'>
              {Object.entries(FACULTY_LINKS)
                .slice(0, 5)
                .map(([key, link]) => (
                  <li key={key} role='listitem'>
                    <a
                      href={link}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={`${tCommon(
                        `faculties.${key}`,
                      )} (opens in a new tab)`}
                      className='navLink'
                    >
                      {tCommon(`faculties.${key}`)}
                    </a>
                  </li>
                ))}

              <li role='listitem'>
                <Hyperlink href={'/faculties'}>{tCommon('seeMore')}</Hyperlink>
              </li>
            </ul>
          </section>
        </nav>

        <hr className={styles.divider} role='separator' />

        <address className={styles.container}>
          <div className={styles.mailContainer}>
            <ContactLink href={`mailto:${CONTACT_INFO.email}`} icon={Mail}>
              {CONTACT_INFO.email}
            </ContactLink>
          </div>

          <div
            className={styles.socialMediaContainer}
            role='group'
            aria-label={tFooter('aria.socialMedia')}
          >
            <a
              href={CONTACT_INFO.socialMedia.instagram}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={tFooter('aria.instagram')}
              className='imgLink'
            >
              <InstagramIcon aria-label='instagramIcon' role='img' />
            </a>
            <a
              href={CONTACT_INFO.socialMedia.facebook}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={tFooter('aria.facebook')}
              className='imgLink'
            >
              <FacebookIcon aria-label='facebookIcon' role='img' />
            </a>
            <a
              href={CONTACT_INFO.socialMedia.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={tFooter('aria.linkedin')}
              className='imgLink'
            >
              <LinkedInIcon aria-label='linkedinIcon' role='img' />
            </a>
          </div>

          <div className={styles.telephoneContainer}>
            <ContactLink href={`mailto:${CONTACT_INFO.phone}`} icon={Telephone}>
              {CONTACT_INFO.phone}
            </ContactLink>
          </div>
        </address>

        <p className={styles.designWatermark}>Designed by Bohdan Popov & ICC</p>
      </div>
    </footer>
  )
}
