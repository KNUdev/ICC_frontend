import ServiceWorkerRegister from '@/components/PWA/ServiceWorkerRegister'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { Geologica, Golos_Text, Inter } from 'next/font/google'
import type { Metadata } from 'next'
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

	const baseUrl = 'https://icc.knu.ua'

	return {
		title: {
			template: `%s | ${t('titleFullName')}`,
			default: t('titleFullName'),
		},
		description: tHome.raw('subheading').replace(/<[^>]*>?/gm, ''),
		metadataBase: new URL(baseUrl),
		alternates: {
			canonical: '/',
			languages: {
				uk: '/uk',
				en: '/en',
			},
		},
		openGraph: {
			title: t('titleFullName'),
			description: tHome.raw('subheading').replace(/<[^>]*>?/gm, ''),
			url: baseUrl,
			siteName: t('titleFullName'),
			locale: locale,
			type: 'website',
			images: [
				{
					url: '/icons/icon-512x512.png',
					width: 512,
					height: 512,
					alt: t('titleFullName'),
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: t('titleFullName'),
			description: tHome.raw('subheading').replace(/<[^>]*>?/gm, ''),
			images: ['/icons/icon-512x512.png'],
		},
		robots: {
			index: true,
			follow: true,
		},
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
