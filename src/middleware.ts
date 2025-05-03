import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
	locales: ['en', 'uk'],
	defaultLocale: 'uk',
	localePrefix: 'always',
	localeCookie: { name: 'locale' },
})

export const config = {
	matcher: ['/((?!api|_next|.*\\..*).*)'],
}
