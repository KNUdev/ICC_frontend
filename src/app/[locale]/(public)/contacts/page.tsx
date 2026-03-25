import ArrowRight from '@/assets/image/icons/arrow-right.svg'
import HomeIcon from '@/assets/image/icons/icon_home.svg'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import { PAGES } from '@/shared/config/page.config'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import ContactsClient from './ContactsClient'
import styles from './page.module.scss'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'contacts' })

	return {
		title: t('title'),
	}
}

export default function Contacts() {
	const tCommon = useTranslations('common')
	const t = useTranslations('contacts')

	return (
		<div className='layout-wrapper'>
			<section
				className={styles.contactsPage + ' main-wrapper'}
				id='top'
				style={{ gap: '2.4rem' }}
			>
				<div className={styles.header}>
					<div className='hyperlink-container'>
						<Hyperlink href={PAGES.HOME}>
							<div className={styles.hyperlink}>
								<HomeIcon />
								<span>{tCommon('backToHome')}</span>
							</div>
						</Hyperlink>
					</div>

					<div className={styles.titleContainer}>
						<h1 className={styles.title}>{t('title')}</h1>
					</div>

					<div className={styles.breadcrumbs}>
						<Link href={PAGES.HOME} className={styles.navLink}>
							{tCommon('navigation.HOME')}
						</Link>
						<ArrowRight />
						<span className={styles.currentPage}>
							{tCommon('navigation.CONTACTS')}
						</span>
					</div>
				</div>

				<ContactsClient />
			</section>
		</div>
	)
}
