import HomeIcon from '@/assets/image/icons/icon_home.svg'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import { PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import styles from '../page.module.scss'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'public/resources' })

	return {
		title: t('ftp.title'),
	}
}

export default function FtpResources() {
	const t = useTranslations('public/resources')
	const items = t.raw('ftp.items') as {
		name: string
		link?: string
		description: string
	}[]

	return (
		<div>
			<section className={styles.historyPage + ' main-wrapper'} id='top'>
				<div className={styles.header}>
					<div className='hyperlink-container'>
						<Hyperlink href={PAGES.RESOURCES}>
							<div className={styles.hyperlink}>
								<HomeIcon />
								<span>{t('backToResources')}</span>
							</div>
						</Hyperlink>
					</div>
					<h1 className={styles.title}>{t('ftp.title')}</h1>
				</div>

				<div className={styles.content}>
					<section className={styles.section}>
						<p>{t('ftp.description')}</p>
					</section>

					<section className={styles.section}>
						{items.map((item, idx) => (
							<div key={idx} style={{ marginBottom: '15px' }}>
								<p>
									<strong>{item.name}</strong>
									{item.link && (
										<span>
											: <Hyperlink href={item.link}>{item.link}</Hyperlink>
										</span>
									)}
									{item.description && <span> {item.description}</span>}
								</p>
							</div>
						))}
					</section>

					<section className={styles.section}>
						<p>{t('ftp.purpose')}</p>
					</section>
				</div>
			</section>
		</div>
	)
}
