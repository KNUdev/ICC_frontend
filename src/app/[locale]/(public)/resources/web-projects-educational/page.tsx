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
		title: t('webProjectsEdu.title'),
	}
}

export default function WebProjectsEdu() {
	const t = useTranslations('public/resources')
	const items = t.raw('webProjectsEdu.items') as { name: string; description: string }[]

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
					<h1 className={styles.title}>{t('webProjectsEdu.title')}</h1>
				</div>

				<div className={styles.content}>
					<section className={styles.section}>
						{items.map((item, idx) => (
							<div key={idx} style={{ marginBottom: '20px' }}>
								<h3>{item.name}</h3>
								<p>{item.description}</p>
							</div>
						))}
					</section>
				</div>
			</section>
		</div>
	)
}
