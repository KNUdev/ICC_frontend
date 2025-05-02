import Negotiator from 'negotiator'
import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import {
	DEFAULT_LOCALE,
	FALLBACK_LOCALE,
	NAMESPACES,
	SUPPORTED_LOCALES,
} from './config'

async function detectLocale(): Promise<string> {
	const cookieStore = await cookies()
	const cookieLocale = cookieStore.get('locale')?.value
	if (
		cookieLocale &&
		SUPPORTED_LOCALES.includes(
			cookieLocale as (typeof SUPPORTED_LOCALES)[number]
		)
	) {
		return cookieLocale
	}
	const headerStore = await headers()
	const acceptLang = headerStore.get('accept-language')
	if (acceptLang) {
		const negotiator = new Negotiator({
			headers: { 'accept-language': acceptLang },
		})
		const lang = negotiator.language([...SUPPORTED_LOCALES])
		if (lang) return lang
	}
	return DEFAULT_LOCALE
}

async function importWithFallback(locale: string, namespace: string) {
	try {
		return (await import(`./locales/${locale}/${namespace}.json`)).default
	} catch {
		console.warn(`Failed to load ${namespace} for locale ${locale}`)
		if (locale !== FALLBACK_LOCALE) {
			try {
				const fallback = (
					await import(`./locales/${FALLBACK_LOCALE}/${namespace}.json`)
				).default
				if (Object.keys(fallback).length === 0) {
					console.error(`Fallback for ${namespace} is empty!`)
					return {}
				}
				return fallback
			} catch {
				console.error(`Failed to load fallback for ${namespace}`)
				return {}
			}
		}
		return {}
	}
}

async function loadMessages(locale: string) {
	const entries = await Promise.all(
		NAMESPACES.map(async namespace => [
			namespace,
			await importWithFallback(locale, namespace),
		])
	)
	return Object.fromEntries(entries)
}

export default getRequestConfig(async () => {
	const locale = await detectLocale()
	const messages = await loadMessages(locale)

	return {
		locale,
		messages,
	}
})
