'use client'
import {
	DEFAULT_LOCALE,
	LANGUAGE_LABELS,
	type Locale,
	SUPPORTED_LOCALES,
} from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { useEffect, useState, useTransition } from 'react'

export default function LanguageSwitcher() {
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()
	const [lang, setLang] = useState<string>(locale)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		const currentLocale = locale || DEFAULT_LOCALE
		setLang(currentLocale)
	}, [locale])

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLang = e.target.value as Locale
		setLang(newLang)

		startTransition(() => {
			const searchParams = new URLSearchParams(window.location.search)
			const params = Object.fromEntries(searchParams.entries())

			router.replace(pathname, {
				locale: newLang,
				...params,
				scroll: false,
			})
		})
	}

	return (
		<div className='language-selector'>
			<label htmlFor='language-select' className='visually-hidden'>
				Select language
			</label>
			<select
				id='language-select'
				onChange={handleChange}
				value={lang}
				disabled={isPending}
				aria-busy={isPending}
				className='language-selector__select'
			>
				{SUPPORTED_LOCALES.map(code => (
					<option key={code} value={code}>
						{LANGUAGE_LABELS[code]}
					</option>
				))}
			</select>
		</div>
	)
}
