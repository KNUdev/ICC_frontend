'use client'

import { useTranslations } from 'next-intl'
import { CONTACT_INFO } from '@/shared/data/footer.data'
import { DIRECTORY_DATA } from '@/shared/data/directory.data'
import { FormApplication } from '../(home)/components/Form/FormApplication/FormApplication'
import ContactLink from '@/common/components/ContactLink/ContactLink'
import AtLineIcon from '@/assets/image/icons/social/at_line.svg'
import PhoneIcon from '@/assets/image/icons/social/telephone.svg'
import styles from './page.module.scss'

export default function ContactsClient() {
	const t = useTranslations('contacts')

	return (
		<div className={styles.content}>
			<div className={styles.infoGrid}>
				<div className={styles.infoCard}>
					<h3>{t('headings.address')}</h3>
					<p>{t('address')}</p>
				</div>

				<div className={styles.infoCard}>
					<h3>{t('headings.postal')}</h3>
					<p>{t('postal')}</p>
				</div>

				<div className={styles.infoCard}>
					<h3>{t('headings.phone')}</h3>
					<ContactLink href={`tel:${CONTACT_INFO.phone}`} icon={PhoneIcon}>
						{CONTACT_INFO.phone}
					</ContactLink>
				</div>

				<div className={styles.infoCard}>
					<h3>{t('headings.email')}</h3>
					<ContactLink href={`mailto:${CONTACT_INFO.email}`} icon={AtLineIcon}>
						{CONTACT_INFO.email}
					</ContactLink>
				</div>
			</div>

			<section className={styles.staffSection}>
				<h2 className={styles.sectionHeading}>{t('headings.staff')}</h2>
				<div className={styles.tableWrapper}>
					<table className={styles.staffTable}>
						<thead>
							<tr>
								<th>{t('table.department')}</th>
								<th>{t('table.name')}</th>
								<th>{t('table.phones')}</th>
								<th>{t('table.room')}</th>
							</tr>
						</thead>
						<tbody>
							{DIRECTORY_DATA.map((entry) => (
								<tr key={entry.id}>
									<td>
										{entry.group && (
											<div className={styles.groupName}>{entry.group}</div>
										)}
										{entry.subGroup && (
											<div className={styles.subGroupName}>
												{entry.subGroup}
											</div>
										)}
										<div className={styles.departmentName}>
											{entry.department}
										</div>
									</td>
									<td>{entry.name || '-'}</td>
									<td>
										{entry.phones.map((phone, index) => (
											<div key={index}>{phone}</div>
										))}
									</td>
									<td>{entry.room || '-'}</td>
								</tr>
							))}
						</tbody>{' '}
					</table>
				</div>
			</section>

			<section className={styles.formSection}>
				<h2 className={styles.sectionHeading}>{t('headings.form')}</h2>
				<div className={styles.formWrapper}>
					<FormApplication formId='contacts' />
				</div>
			</section>

			<section className={styles.mapSection}>
				<h2 className={styles.sectionHeading}>{t('headings.map')}</h2>
				<p className={styles.mapMarker}>{t('mapMarker')}</p>
				<div className={styles.mapContainer}>
					<iframe
						src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2544.2239806346915!2d30.470422477223785!3d50.381023071578944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4c8e5948a636d%3A0x4c0662694a6362db!2z0L_RgNC-0YHQvy4g0JDQutCw0LTQtdC80LjQutCwINCT0LvRg9GI0LrQvtCy0LAsIDQsINCa0LjQtdCyLCAwMzY4MA!5e0!3m2!1sru!2sua!4v1774456914216!5m2!1sru!2sua'
						width='100%'
						height='450'
						style={{ border: 0, borderRadius: 'var(--border-radius-m, 12px)' }}
						allowFullScreen={false}
						loading='lazy'
						referrerPolicy='no-referrer-when-downgrade'
						title='ICC Location Map'
					></iframe>
				</div>
			</section>
		</div>
	)
}
