import ServiceWorkerRegister from '@/components/PWA/ServiceWorkerRegister'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Geologica, Golos_Text, Inter } from 'next/font/google'
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
