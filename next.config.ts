import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withPWAInit from 'next-pwa'

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    })
    return config
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  ...(process.env.NODE_ENV === 'production' && {
    images: {
      domains: ['knu-icc.netlify.app'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'd86351cc47b006577bb439ee64d44767.serveo.net',
          pathname: '/images/**',
        },
      ],
      loader: 'custom',
      loaderFile: 'src/shared/lib/netlifyImageLoader.ts',
    },
  }),
  ...(process.env.NODE_ENV === 'development' && {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5003',
          pathname: '/images/**',
        },
      ],
    },
  }),
}

const withNextIntl = createNextIntlPlugin()

const withPWA = withPWAInit({
  dest: 'public',
  register: false, // We'll register SW manually via a client component
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
})

export default withNextIntl(withPWA(nextConfig))
