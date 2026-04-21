import ServiceWorkerRegister from '@/components/PWA/ServiceWorkerRegister'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { Geologica, Golos_Text, Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import React from 'react'
import './globals.scss'

const inter = Inter({
	subsets: ['latin', 'cyrillic-ext'],
	variable: '--font-inter',
	display: 'swap',
})

const geologica = Geologica({
	subsets: ['latin', 'cyrillic-ext'],
	variable: '--font-geologica',
	display: 'swap',
})

const golos = Golos_Text({
	subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
	variable: '--font-golos',
	display: 'swap',
})

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'common' })
	const tHome = await getTranslations({ locale, namespace: 'home' })

	const headerList = await headers()
	const host = headerList.get('host')
	const protocol = headerList.get('x-forwarded-proto') || 'https'
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

	const description = tHome
		.raw('subheading')
		.replace(/<[^>]*>?/gm, '')
		.replace(/[«»“”]/g, '')
		.trim()

	const truncatedDescription =
		description.length > 160
			? description.substring(0, 157) + '...'
			: description

	const title = t('titleFullName')
	const titleLong = t('titleLong')

	return {
		title: {
			template: `%s | ${title}`,
			default: titleLong,
		},
		description: truncatedDescription,
		metadataBase: new URL(baseUrl),
		alternates: {
			languages: {
				uk: '/uk',
				en: '/en',
			},
		},
		openGraph: {
			title: titleLong,
			description: truncatedDescription,
			url: `${baseUrl}/${locale}`,
			siteName: title,
			locale: locale,
			type: 'website',
			images: [
				{
					url: `${baseUrl}/icons/icon-512x512.png`,
					width: 512,
					height: 512,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: titleLong,
			description: truncatedDescription,
			images: [`${baseUrl}/icons/icon-512x512.png`],
		},
		other: {
			'twitter:domain': new URL(baseUrl).host,
		},
		robots: {
			index: true,
			follow: true,
		},
	}
}

export function generateViewport() {
	return {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
		userScalable: false,
		viewportFit: 'cover',
		themeColor: '#f6f6f6',
	}
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const locale = await getLocale()
	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body
				className={`${inter.variable} ${geologica.variable} ${golos.variable}`}
			>
				<div className='container'>
					<NextIntlClientProvider locale={locale} messages={messages}>
						{children}
					</NextIntlClientProvider>
				</div>
				<ServiceWorkerRegister />
			</body>
		</html>
	)
}
