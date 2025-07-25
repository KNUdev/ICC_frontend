import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Geologica, Inter } from 'next/font/google'
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

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
  },
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
      <body className={`${inter.variable} ${geologica.variable}`}>
        <div className='container'>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  )
}
