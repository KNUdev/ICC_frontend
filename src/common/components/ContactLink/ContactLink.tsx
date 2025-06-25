import Link from 'next/link'
import type { ComponentType, ReactNode } from 'react'
import styles from './ContactLink.module.scss'

interface ContactLinkProps {
  href: string
  icon?: ComponentType
  children: ReactNode
}

const isExternalLink = (href: string): boolean => {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//')
  )
}

const ContactLink = ({
  href,
  icon: IconComponent,
  children,
}: ContactLinkProps) => {
  const linkContent = (
    <>
      {IconComponent && <IconComponent />}
      <span>{children}</span>
    </>
  )

  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        className={styles.ContactLink}
        target='_blank'
        rel='noopener noreferrer'
      >
        {linkContent}
      </a>
    )
  }

  return (
    <Link href={href} passHref className={styles.ContactLink}>
      {linkContent}
    </Link>
  )
}

export default ContactLink
