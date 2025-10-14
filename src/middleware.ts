import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['en', 'uk'],
  defaultLocale: 'uk',
  localePrefix: 'always',
  localeCookie: { name: 'locale' },
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cookieLocale = request.cookies.get('locale')?.value

  const pathnameLocale = pathname.split('/')[1]

  const supportedLocales = ['en', 'uk']
  const isLocaleInPath = supportedLocales.includes(pathnameLocale)

  if (cookieLocale && isLocaleInPath && cookieLocale !== pathnameLocale) {
    const newPathname = pathname.replace(
      `/${pathnameLocale}`,
      `/${cookieLocale}`,
    )
    const url = request.nextUrl.clone()
    url.pathname = newPathname
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
