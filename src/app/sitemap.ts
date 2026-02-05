import type { MetadataRoute } from 'next'
import { PAGES } from '@/shared/config/page.config'
import { SUPPORTED_LOCALES } from '@/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://icc.knu.ua'

	const routes = [
		PAGES.HOME,
		PAGES.PHOTO_GALLERY,
		PAGES.HISTORY,
		PAGES.STAFF,
		PAGES.DOCUMENTS,
		PAGES.RESOURCES,
		PAGES.NOC,
	].filter((path) => typeof path === 'string' && path.startsWith('/'))

	const sitemapEntries: MetadataRoute.Sitemap = []

	for (const locale of SUPPORTED_LOCALES) {
		for (const route of routes) {
			const url = `${baseUrl}/${locale}${route === '/' ? '' : route}`
			sitemapEntries.push({
				url,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: route === '/' ? 1 : 0.8,
			})
		}
	}

	return sitemapEntries
}
