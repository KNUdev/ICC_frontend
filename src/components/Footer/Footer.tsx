import logoKnu from '@/assets/image/icons/logo_knu.png'
import FacebookIcon from '@/assets/image/icons/social/facebook.svg'
import InstagramIcon from '@/assets/image/icons/social/instagram.svg'
import LinkedInIcon from '@/assets/image/icons/social/linkedin.svg'
import Mail from '@/assets/image/icons/social/mail.svg'
import Telephone from '@/assets/image/icons/social/telephone.svg'
import ContactLink from '@/common/components/ContactLink/ContactLink'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import {
  contactInfo,
  facultyLinks,
  footerNavigation,
  institutionLinks,
} from '@/lib/footerData'
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
              {footerNavigation.map(({ key, link }) => (
                <li key={key} role='listitem'>
                  <Link href={link} className='navLink'>
                    {tFooter(`navigation.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.navContainer}>
            <h3 className={styles.heading}>{tCommon('institutionsHeading')}</h3>

            <ul className={styles.list} role='list'>
              {institutionLinks.slice(0, 5).map(({ key, link }) => (
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
              {facultyLinks.slice(0, 5).map(({ key, link }) => (
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
            <ContactLink href={`mailto:${contactInfo.email}`} icon={Mail}>
              {contactInfo.email}
            </ContactLink>
          </div>

          <div
            className={styles.socialMediaContainer}
            role='group'
            aria-label={tFooter('aria.socialMedia')}
          >
            <a
              href={contactInfo.socialMedia.instagram}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={tFooter('aria.instagram')}
              className='imgLink'
            >
              <InstagramIcon aria-label='instagramIcon' role='img' />
            </a>
            <a
              href={contactInfo.socialMedia.facebook}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={tFooter('aria.facebook')}
              className='imgLink'
            >
              <FacebookIcon aria-label='facebookIcon' role='img' />
            </a>
            <a
              href={contactInfo.socialMedia.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={tFooter('aria.linkedin')}
              className='imgLink'
            >
              <LinkedInIcon aria-label='linkedinIcon' role='img' />
            </a>
          </div>

          <div className={styles.telephoneContainer}>
            <ContactLink href={`mailto:${contactInfo.phone}`} icon={Telephone}>
              {contactInfo.phone}
            </ContactLink>
          </div>
        </address>
      </div>
    </footer>
  )
}
