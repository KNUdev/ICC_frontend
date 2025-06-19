import Link from 'next/link'
import { ComponentType, ReactNode } from 'react'
import styles from './Hyperlink.module.scss'

interface HyperlinkProps {
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

const Hyperlink = ({ href, icon: IconComponent, children }: HyperlinkProps) => {
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
        className={styles.hyperlink}
        target='_blank'
        rel='noopener noreferrer'
      >
        {linkContent}
      </a>
    )
  }

  return (
    <Link href={href} passHref className={styles.hyperlink}>
      {linkContent}
    </Link>
  )
}

export default Hyperlink
