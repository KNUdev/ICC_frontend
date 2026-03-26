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
		title: t('proxy.title'),
	}
}

export default function ProxyResources() {
	const t = useTranslations('public/resources')
	const stats = t.raw('proxy.stats') as string[]

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
					<h1 className={styles.title}>{t('proxy.title')}</h1>
				</div>

				<div className={styles.content}>
					<section className={styles.section}>
						<p>{t('proxy.description')}</p>
					</section>

					<section className={styles.section}>
						<ul style={{ paddingLeft: '20px', color: '#454545' }}>
							{stats.map((stat, idx) => (
								<li key={idx} style={{ marginBottom: '10px' }}>
									{stat}
								</li>
							))}
						</ul>
					</section>

					<section className={styles.section}>
						<p>{t('proxy.monitoring')}</p>
					</section>
				</div>
			</section>
		</div>
	)
}
