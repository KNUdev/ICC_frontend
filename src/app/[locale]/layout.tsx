import { routing } from '@/i18n/routing'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const locale = await getLocale()
	const messages = await getMessages()
	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider locale={locale} messages={messages}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
