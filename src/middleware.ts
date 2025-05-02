import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
	...routing,
	localeCookie: {
		name: 'locale',
		path: '/',
		maxAge: 365 * 24 * 60 * 60,
		sameSite: 'lax',
	},
	localePrefix: 'always',
})

export const config = {
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
