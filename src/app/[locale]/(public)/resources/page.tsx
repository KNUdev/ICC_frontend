import HomeIcon from '@/assets/image/icons/icon_home.svg'
import Hyperlink from '@/common/components/Hyperlink/Hyperlink'
import { PAGES } from '@/shared/config/page.config'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import styles from './page.module.scss'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'public/resources' })

	return {
		title: t('title'),
	}
}

export default function Resources() {
	const tCommon = useTranslations('common')
	const t = useTranslations('public/resources')
	const list = t.raw('list') as { name: string; link: string }[]

	return (
		<div>
			<section className={styles.historyPage + ' main-wrapper'} id='top'>
				<div className={styles.header}>
					<div className='hyperlink-container'>
						<Hyperlink href={PAGES.HOME}>
							<div className={styles.hyperlink}>
								<HomeIcon />
								<span>{tCommon('backToHome')}</span>
							</div>
						</Hyperlink>
					</div>
					<h1 className={styles.title}>{t('title')}</h1>
				</div>

				<div className={styles.content}>
					<section className={styles.section}>
						<p>{t('description')}</p>
					</section>

					<section className={styles.section}>
						{list.map((item, idx) => (
							<div key={idx} style={{ marginBottom: '10px' }}>
								<Hyperlink href={item.link}>{item.name}</Hyperlink>
							</div>
						))}
					</section>
				</div>
			</section>
		</div>
	)
}
